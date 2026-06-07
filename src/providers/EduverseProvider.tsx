import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Linking } from "react-native";
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
  getSessionUser,
  loadAssignmentsForClasses,
  loadMaterialsForClasses,
  loadMessagesForClass,
  loadNotifications,
  loadOrganizationClasses,
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
  subscribeToNotificationInserts,
  submitAssignmentText,
  type AppOrganization,
  type AppUser,
  type ChatMessage,
  type ClassAssignment,
  type ClassMaterial,
  type NotificationRecord,
  type OrganizationClass
} from "@/services/eduverseApi";

type DataStatus = "idle" | "loading" | "ready" | "error";

const PUSH_NOTIFICATIONS_KEY = "eduverse:push-notifications-enabled";

type EduverseContextValue = {
  activeClass: OrganizationClass | null;
  activeOrganization: AppOrganization | null;
  assignments: ClassAssignment[];
  classes: OrganizationClass[];
  errorMessage: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  materials: ClassMaterial[];
  messages: ChatMessage[];
  notificationStatus: DeviceNotificationStatus;
  notifications: NotificationRecord[];
  organizations: AppOrganization[];
  pushNotificationsEnabled: boolean;
  status: DataStatus;
  user: AppUser | null;
  forgotPassword(email: string): Promise<void>;
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
  const [activeOrganization, setActiveOrganization] = useState<AppOrganization | null>(null);
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [classes, setClasses] = useState<OrganizationClass[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [materials, setMaterials] = useState<ClassMaterial[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notificationStatus, setNotificationStatus] = useState<DeviceNotificationStatus>("idle");
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [organizations, setOrganizations] = useState<AppOrganization[]>([]);
  const [pushNotificationsEnabled, setPushNotificationsEnabledState] = useState(false);
  const [status, setStatus] = useState<DataStatus>("loading");
  const [user, setUser] = useState<AppUser | null>(null);

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
        setActiveOrganization(null);
        setAssignments([]);
        setClasses([]);
        setMaterials([]);
        setMessages([]);
        setNotifications([]);
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
        setAssignments([]);
        setClasses([]);
        setMaterials([]);
        setMessages([]);
        setNotifications([]);
        setStatus("ready");
        return;
      }

      const nextClasses = await loadOrganizationClasses(profileState.activeOrganization.id);
      const nextClassIds = nextClasses.map((classItem) => classItem.id);
      setClasses(nextClasses);
      setActiveClassId((current) => (current && nextClasses.some((classItem) => classItem.id === current) ? current : nextClasses[0]?.id ?? null));

      const [nextNotifications, nextAssignments, nextMaterials] = await Promise.all([
        loadNotifications(profileState.activeOrganization.id, sessionUser.id),
        loadAssignmentsForClasses(nextClassIds, sessionUser.id, profileState.user.role === "admin" || profileState.user.role === "teacher"),
        loadMaterialsForClasses(nextClassIds)
      ]);

      setAssignments(nextAssignments);
      setMaterials(nextMaterials);
      setNotifications(nextNotifications);

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

    return subscribeToNotificationInserts({
      organizationId: activeOrganization.id,
      userId: authUser.id,
      onInsert: (notification) => {
        setNotifications((current) => {
          if (current.some((item) => item.id === notification.id)) return current;
          return [notification, ...current].slice(0, 30);
        });

        if (pushNotificationsEnabled && notificationStatus === "granted") {
          void showEduverseNotification(notification).catch(() => null);
        }
      }
    });
  }, [activeOrganization, authUser, notificationStatus, pushNotificationsEnabled]);

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
      const download = await loadMaterialDownloadUrl(material.classId, material.id);
      await Linking.openURL(download.url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not open this material.");
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
    await signOut();
    await refresh();
  }

  const value: EduverseContextValue = {
    activeClass,
    activeOrganization,
    assignments,
    classes,
    errorMessage,
    forgotPassword,
    isAuthenticated: Boolean(authUser),
    isLoading: status === "loading",
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
