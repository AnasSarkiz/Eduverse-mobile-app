import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@supabase/supabase-js";

import {
  addNotificationResponseListener,
  configureDeviceNotifications,
  requestDeviceNotificationPermission,
  showEduverseNotification,
  type DeviceNotificationStatus
} from "@/services/deviceNotifications";
import {
  createLiveSessionToken,
  endClassLiveSession,
  getSessionUser,
  heartbeatClassLiveSession,
  loadAssignmentsForClasses,
  loadMaterialsForClasses,
  loadMessagesForClass,
  loadNotifications,
  loadOrganizationClasses,
  loadOrganizationLiveSessions,
  loadProfileAndOrganizations,
  loadMaterialDownloadUrl,
  markNotificationRead,
  onAuthStateChange,
  resetPassword,
  sendClassMessage,
  setDefaultOrganization,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  startClassLiveSession,
  submitAssignmentText,
  type AppOrganization,
  type AppUser,
  type ChatMessage,
  type ClassAssignment,
  type ClassLiveSession,
  type ClassMaterial,
  type LiveSessionToken,
  type NotificationRecord,
  type OrganizationClass
} from "@/services/eduverseApi";
import { downloadAndShareMaterial } from "@/services/materialDownloads";

type DataStatus = "idle" | "loading" | "ready" | "error";

const PUSH_NOTIFICATIONS_KEY = "eduverse:push-notifications-enabled";
const NOTIFICATION_POLL_INTERVAL_MS = 45_000;

export type ActiveLiveSession = {
  classId: string;
  className: string;
  isHost: boolean;
  joinedAt: string;
  markedLiveAt: string | null;
  token: LiveSessionToken;
};

type EduverseContextValue = {
  activeClass: OrganizationClass | null;
  activeLiveSession: ActiveLiveSession | null;
  activeOrganization: AppOrganization | null;
  assignments: ClassAssignment[];
  classes: OrganizationClass[];
  downloadingMaterialId: string | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  liveSessions: ClassLiveSession[];
  materials: ClassMaterial[];
  messages: ChatMessage[];
  notificationStatus: DeviceNotificationStatus;
  notifications: NotificationRecord[];
  organizations: AppOrganization[];
  pushNotificationsEnabled: boolean;
  status: DataStatus;
  user: AppUser | null;
  forgotPassword(email: string): Promise<void>;
  joinLiveSession(classId: string): Promise<void>;
  leaveLiveSession(options?: { endSession?: boolean }): Promise<void>;
  markLiveSessionConnected(): Promise<void>;
  markRead(notificationId: string): Promise<void>;
  openMaterial(materialId: string): Promise<void>;
  refresh(): Promise<void>;
  selectClass(classId: string): Promise<void>;
  selectOrganization(organizationId: string): Promise<void>;
  sendMessage(content: string): Promise<void>;
  setPushNotificationsEnabled(enabled: boolean): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName: string): Promise<void>;
  signOutUser(): Promise<void>;
  submitAssignment(assignmentId: string, textResponse: string): Promise<void>;
};

const EduverseContext = createContext<EduverseContextValue | null>(null);

export function EduverseProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [activeLiveSession, setActiveLiveSession] = useState<ActiveLiveSession | null>(null);
  const [activeOrganization, setActiveOrganization] = useState<AppOrganization | null>(null);
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [classes, setClasses] = useState<OrganizationClass[]>([]);
  const [downloadingMaterialId, setDownloadingMaterialId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveSessions, setLiveSessions] = useState<ClassLiveSession[]>([]);
  const [materials, setMaterials] = useState<ClassMaterial[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notificationStatus, setNotificationStatus] = useState<DeviceNotificationStatus>("idle");
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [organizations, setOrganizations] = useState<AppOrganization[]>([]);
  const [pushNotificationsEnabled, setPushNotificationsEnabledState] = useState(false);
  const [status, setStatus] = useState<DataStatus>("loading");
  const [user, setUser] = useState<AppUser | null>(null);
  const knownNotificationIdsRef = useRef<Set<string>>(new Set());

  const activeClass = useMemo(() => classes.find((classItem) => classItem.id === activeClassId) ?? classes[0] ?? null, [activeClassId, classes]);
  const classIds = useMemo(() => classes.map((classItem) => classItem.id), [classes]);
  const canManage = user?.role === "admin" || user?.role === "teacher";

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const sessionUser = await getSessionUser();
      setAuthUser(sessionUser);

      if (!sessionUser) {
        setActiveLiveSession(null);
        setActiveOrganization(null);
        setAssignments([]);
        setClasses([]);
        setLiveSessions([]);
        setMaterials([]);
        setMessages([]);
        setNotifications([]);
        knownNotificationIdsRef.current = new Set();
        setOrganizations([]);
        setUser(null);
        setStatus("ready");
        return;
      }

      const profileState = await loadProfileAndOrganizations(sessionUser);
      setActiveOrganization(profileState.activeOrganization);
      setOrganizations(profileState.organizations);
      setUser(profileState.user);

      if (!profileState.activeOrganization) {
        setActiveLiveSession(null);
        setAssignments([]);
        setClasses([]);
        setLiveSessions([]);
        setMaterials([]);
        setMessages([]);
        setNotifications([]);
        knownNotificationIdsRef.current = new Set();
        setStatus("ready");
        return;
      }

      const nextClasses = await loadOrganizationClasses(profileState.activeOrganization.id);
      const nextClassIds = nextClasses.map((classItem) => classItem.id);
      setClasses(nextClasses);
      setActiveClassId((current) => (current && nextClasses.some((classItem) => classItem.id === current) ? current : nextClasses[0]?.id ?? null));

      const [nextNotifications, nextAssignments, nextMaterials, nextLiveSessions] = await Promise.all([
        loadNotifications(profileState.activeOrganization.id, sessionUser.id),
        loadAssignmentsForClasses(nextClassIds, sessionUser.id, profileState.user.role === "admin" || profileState.user.role === "teacher"),
        loadMaterialsForClasses(nextClassIds),
        loadOrganizationLiveSessions(profileState.activeOrganization.id)
      ]);

      setAssignments(nextAssignments);
      setLiveSessions(nextLiveSessions);
      setMaterials(nextMaterials);
      setNotifications(nextNotifications);
      knownNotificationIdsRef.current = new Set(nextNotifications.map((notification) => notification.id));

      const firstClass = nextClasses[0];
      setMessages(firstClass ? await loadMessagesForClass(firstClass.id) : []);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load Eduverse data.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const { data } = onAuthStateChange((nextUser) => {
      setAuthUser(nextUser);
      void refresh();
    });

    return () => data.subscription.unsubscribe();
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;

    async function initializeNotifications() {
      const [deviceStatus, savedPreference] = await Promise.all([
        configureDeviceNotifications(),
        AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY)
      ]);

      if (cancelled) return;
      setNotificationStatus(deviceStatus);
      setPushNotificationsEnabledState(savedPreference === "true" && deviceStatus === "granted");
    }

    void initializeNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const subscription = addNotificationResponseListener((notificationId) => {
      if (notificationId) void markRead(notificationId);
      void refresh();
    });

    return () => subscription.remove();
  }, [refresh]);

  useEffect(() => {
    if (!authUser || !activeOrganization) return undefined;

    let cancelled = false;

    const pollNotifications = async () => {
      try {
        const nextNotifications = await loadNotifications(activeOrganization.id, authUser.id);
        if (cancelled) return;

        const knownIds = knownNotificationIdsRef.current;
        const newNotifications = nextNotifications.filter((notification) => !knownIds.has(notification.id));

        knownNotificationIdsRef.current = new Set(nextNotifications.map((notification) => notification.id));
        setNotifications(nextNotifications);

        if (pushNotificationsEnabled && notificationStatus === "granted") {
          for (const notification of [...newNotifications].reverse()) {
            void showEduverseNotification(notification).catch(() => null);
          }
        }

        if (newNotifications.some((notification) => notification.type === "session_started")) {
          void refresh();
        }
      } catch {
        // Keep polling quiet; the main refresh path owns user-facing errors.
      }
    };

    const intervalId = setInterval(() => {
      void pollNotifications();
    }, NOTIFICATION_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [activeOrganization, authUser, notificationStatus, pushNotificationsEnabled, refresh]);

  useEffect(() => {
    if (!activeLiveSession?.isHost || !activeLiveSession.markedLiveAt) return undefined;

    const heartbeat = () => {
      void heartbeatClassLiveSession({
        classId: activeLiveSession.classId,
        liveSessionId: activeLiveSession.token.liveSessionId,
        roomName: activeLiveSession.token.roomName
      }).catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Could not keep the live session active.");
      });
    };

    const intervalId = setInterval(heartbeat, 60_000);
    return () => clearInterval(intervalId);
  }, [activeLiveSession]);

  async function selectOrganization(organizationId: string) {
    if (!authUser) return;
    await setDefaultOrganization(authUser.id, organizationId);
    await refresh();
  }

  async function selectClass(classId: string) {
    setActiveClassId(classId);
    setMessages(await loadMessagesForClass(classId));
  }

  async function sendMessage(content: string) {
    if (!activeClass || !activeOrganization || !user) return;
    await sendClassMessage({
      classId: activeClass.id,
      content,
      organizationId: activeOrganization.id,
      role: user.role,
      userId: user.id
    });
    setMessages(await loadMessagesForClass(activeClass.id));
  }

  async function submitAssignment(assignmentId: string, textResponse: string) {
    if (!authUser) return;
    const assignment = assignments.find((item) => item.id === assignmentId);
    if (!assignment) return;
    await submitAssignmentText(assignment, authUser.id, textResponse);
    setAssignments(await loadAssignmentsForClasses(classIds, authUser.id, canManage));
  }

  async function markRead(notificationId: string) {
    await markNotificationRead(notificationId);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, readAt: notification.readAt ?? new Date().toISOString() } : notification
      )
    );
  }

  async function joinLiveSession(classId: string) {
    if (!user) return;

    const liveSession = liveSessions.find((session) => session.class_id === classId);
    const canStartSession = user.role === "admin" || user.role === "teacher";

    if (!liveSession && !canStartSession) {
      setErrorMessage("No live session is active for this class yet.");
      return;
    }

    try {
      setErrorMessage(null);
      const token = await createLiveSessionToken({
        classId,
        liveSessionId: liveSession?.live_session_id ?? null,
        user
      });
      const classItem = classes.find((item) => item.id === classId);

      setActiveLiveSession({
        classId,
        className: classItem?.name ?? "Live session",
        isHost: !liveSession && canStartSession,
        joinedAt: new Date().toISOString(),
        markedLiveAt: liveSession ? liveSession.started_at : null,
        token
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not join the live session.");
    }
  }

  async function markLiveSessionConnected() {
    if (!activeLiveSession?.isHost || activeLiveSession.markedLiveAt) return;

    try {
      setErrorMessage(null);
      await startClassLiveSession({
        classId: activeLiveSession.classId,
        liveSessionId: activeLiveSession.token.liveSessionId,
        roomName: activeLiveSession.token.roomName
      });
      const markedLiveAt = new Date().toISOString();
      setActiveLiveSession((current) => (current ? { ...current, markedLiveAt } : current));
      if (activeOrganization) {
        setLiveSessions(await loadOrganizationLiveSessions(activeOrganization.id));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not start the live session.");
    }
  }

  async function leaveLiveSession(options: { endSession?: boolean } = {}) {
    const session = activeLiveSession;
    setActiveLiveSession(null);
    if (!session) return;

    const shouldEndSession = options.endSession ?? session.isHost;
    if (!shouldEndSession || !session.markedLiveAt) return;

    try {
      await endClassLiveSession({
        classId: session.classId,
        liveSessionId: session.token.liveSessionId,
        roomName: session.token.roomName
      });
      if (activeOrganization) {
        setLiveSessions(await loadOrganizationLiveSessions(activeOrganization.id));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not end the live session.");
    }
  }

  async function setPushNotificationsEnabled(enabled: boolean) {
    if (!enabled) {
      await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, "false");
      setPushNotificationsEnabledState(false);
      return;
    }

    const nextStatus = await requestDeviceNotificationPermission();
    setNotificationStatus(nextStatus);

    if (nextStatus === "granted") {
      await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, "true");
      setPushNotificationsEnabledState(true);
      setErrorMessage(null);
      return;
    }

    await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, "false");
    setPushNotificationsEnabledState(false);
    setErrorMessage(
      nextStatus === "denied"
        ? "Notifications are blocked. Enable them in system settings to receive Eduverse alerts."
        : "Notifications are unavailable on this device."
    );
  }

  async function openMaterial(materialId: string) {
    const material = materials.find((item) => item.id === materialId);
    if (!material) return;

    try {
      setErrorMessage(null);
      setDownloadingMaterialId(material.id);
      const download = await loadMaterialDownloadUrl(material.classId, material.id, "attachment");
      await downloadAndShareMaterial({
        fileName: download.fileName || material.originalFilename || material.title,
        mimeType: download.mimeType || material.mimeType,
        title: material.title,
        url: download.url
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not download this material.");
    } finally {
      setDownloadingMaterialId(null);
    }
  }

  async function signIn(email: string, password: string) {
    await signInWithPassword(email, password);
    await refresh();
  }

  async function signUp(email: string, password: string, displayName: string) {
    await signUpWithPassword(email, password, displayName);
    await refresh();
  }

  async function forgotPassword(email: string) {
    await resetPassword(email);
  }

  async function signOutUser() {
    setActiveLiveSession(null);
    await signOut();
    await refresh();
  }

  const value: EduverseContextValue = {
    activeClass,
    activeLiveSession,
    activeOrganization,
    assignments,
    classes,
    downloadingMaterialId,
    errorMessage,
    forgotPassword,
    isAuthenticated: Boolean(authUser),
    isLoading: status === "loading",
    joinLiveSession,
    leaveLiveSession,
    liveSessions,
    markLiveSessionConnected,
    markRead,
    materials,
    messages,
    notificationStatus,
    notifications,
    openMaterial,
    organizations,
    pushNotificationsEnabled,
    refresh,
    selectClass,
    selectOrganization,
    sendMessage,
    setPushNotificationsEnabled,
    signIn,
    signOutUser,
    signUp,
    status,
    submitAssignment,
    user
  };

  return <EduverseContext.Provider value={value}>{children}</EduverseContext.Provider>;
}

export function useEduverse() {
  const context = useContext(EduverseContext);
  if (!context) throw new Error("useEduverse must be used inside EduverseProvider.");
  return context;
}
