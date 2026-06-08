import type { User } from "@supabase/supabase-js";

import { eduverseApiUrl } from "@/config/env";
import { getSupabaseClient } from "@/lib/supabase";

export type OrganizationUserRole = "org_owner" | "org_admin" | "teacher" | "student";
export type AppRole = "admin" | "teacher" | "student";

export type ProfileRecord = {
  id: string;
  email: string;
  display_name: string;
  default_organization_id: string | null;
};

export type AppOrganization = {
  id: string;
  slug: string;
  name: string;
  membershipId: string;
  roles: OrganizationUserRole[];
  selectedRole: OrganizationUserRole;
  selectedRoleId: string | null;
  isDefault: boolean;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  institution: string;
};

export type ClassMembership = {
  id: string;
  class_id: string;
  user_id: string;
  role: "teacher" | "student" | "ta";
};

export type OrganizationClass = {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  subject: string;
  teacher_user_id: string | null;
  color: string | null;
  description: string;
  schedule_text: string | null;
  room: string | null;
  semester: string | null;
  is_archived: boolean;
  memberships: ClassMembership[];
  teacher: { id: string; display_name: string; email: string } | null;
};

export type ClassAssignment = {
  id: string;
  organizationId: string;
  classId: string;
  title: string;
  description: string;
  dueAt: string;
  maxScore: number;
  status: "draft" | "published";
  mySubmission: ClassAssignmentSubmission | null;
};

export type ClassAssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentUserId: string;
  submittedAt: string;
  score: number | null;
  feedback: string;
  gradedAt: string | null;
};

export type ClassMaterial = {
  id: string;
  classId: string;
  organizationId?: string;
  title: string;
  description: string;
  type: "image" | "pdf" | "video" | "slide";
  originalFilename: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  classId: string;
  senderId: string;
  senderRole: "student" | "teacher" | "admin";
  senderName: string;
  content: string;
  kind: "text" | "announcement" | "media";
  materialId?: string | null;
  mediaTitle?: string | null;
  originalFilename?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  materialType?: "image" | "pdf" | "video" | "slide" | null;
  isMaterialDeleted?: boolean;
  createdAt: string;
};

export type NotificationRecord = {
  id: string;
  organizationId: string;
  classId: string | null;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export type ClassLiveSession = {
  id: string;
  organization_id: string;
  class_id: string;
  room_name: string;
  live_session_id: string;
  started_by_user_id: string;
  status: "pending" | "live" | "ended";
  started_at: string;
  last_seen_at: string;
  ended_at: string | null;
};

export type LiveSessionToken = {
  liveSessionId: string;
  participantToken: string;
  roomName: string;
  serverUrl: string;
};

export type LiveSessionUpdateResult = {
  liveSessionId?: string;
  ok: boolean;
};

function db() {
  return getSupabaseClient();
}

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const { data, error } = await db().auth.getSession();
  if (error) throw error;

  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Authentication required. Sign in again to use Eduverse services.");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(eduverseApiUrl(path), {
    ...init,
    headers
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload?.error === "string" && payload.error.trim()
        ? payload.error
        : `Eduverse API request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload as T;
}

function jsonRequest<T>(path: string, body?: unknown, init: RequestInit = {}) {
  return apiRequest<T>(path, {
    ...init,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...init.headers
    }
  });
}

export async function getSessionUser() {
  const { data, error } = await db().auth.getUser();
  if (error?.message === "Auth session missing!") return null;
  if (error) throw error;
  return data.user;
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await db().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithPassword(email: string, password: string, displayName: string) {
  const { error } = await db().auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await db().auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function signOut() {
  const { error } = await db().auth.signOut();
  if (error) throw error;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return db().auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
}

export async function loadProfileAndOrganizations(user: User) {
  const payload = await apiRequest<{
    currentUser: AppUser;
    organizations: AppOrganization[];
  }>("/api/me");
  const organizations = payload.organizations ?? [];
  const activeOrganization =
    organizations.find((organization) => organization.isDefault) ?? organizations[0] ?? null;
  const appUser: AppUser = {
    ...payload.currentUser,
    institution: activeOrganization?.name ?? payload.currentUser.institution,
    role: toAppRole(activeOrganization?.selectedRole)
  };
  const profile: ProfileRecord = {
    id: user.id,
    email: payload.currentUser.email || user.email || "",
    display_name: payload.currentUser.name || user.email?.split("@")[0] || "User",
    default_organization_id: activeOrganization?.id ?? null
  };

  return {
    activeOrganization,
    organizations,
    profile,
    user: appUser
  };
}

export async function setDefaultOrganization(_profileId: string, organizationId: string) {
  await jsonRequest("/api/me", { defaultOrganizationId: organizationId }, { method: "PATCH" });
}

export async function loadOrganizationClasses(organizationId: string) {
  const payload = await apiRequest<{ classes: OrganizationClass[] }>(`/api/organizations/${organizationId}/classes`);
  return payload.classes ?? [];
}

export async function loadNotifications(organizationId: string, _userId: string) {
  const payload = await apiRequest<{ notifications: NotificationRecord[] }>(
    `/api/notifications?organizationId=${encodeURIComponent(organizationId)}`
  );
  return payload.notifications ?? [];
}

export async function loadOrganizationLiveSessions(organizationId: string) {
  const payload = await apiRequest<{ liveSessions: ClassLiveSession[] }>(`/api/organizations/${organizationId}/live-sessions`);
  return payload.liveSessions ?? [];
}

export async function createLiveSessionToken(input: {
  classId: string;
  liveSessionId?: string | null;
  user: AppUser;
}) {
  return jsonRequest<LiveSessionToken>(
    "/api/livekit/token",
    {
      classId: input.classId,
      liveSessionId: input.liveSessionId,
      user: {
        id: input.user.id,
        name: input.user.name,
        role: input.user.role
      }
    },
    { method: "POST" }
  );
}

export async function startClassLiveSession(input: {
  classId: string;
  liveSessionId: string;
  roomName: string;
}) {
  return jsonRequest<LiveSessionUpdateResult>(
    `/api/classes/${input.classId}/live-session`,
    {
      liveSessionId: input.liveSessionId,
      roomName: input.roomName
    },
    { method: "POST" }
  );
}

export async function heartbeatClassLiveSession(input: {
  classId: string;
  liveSessionId: string;
  roomName: string;
}) {
  return jsonRequest<LiveSessionUpdateResult>(
    `/api/classes/${input.classId}/live-session`,
    {
      liveSessionId: input.liveSessionId,
      roomName: input.roomName
    },
    { method: "PATCH" }
  );
}

export async function endClassLiveSession(input: {
  classId: string;
  liveSessionId: string;
  roomName: string;
}) {
  return jsonRequest<LiveSessionUpdateResult>(
    `/api/classes/${input.classId}/live-session`,
    {
      liveSessionId: input.liveSessionId,
      roomName: input.roomName
    },
    { method: "DELETE" }
  );
}

export async function markNotificationRead(notificationId: string) {
  await jsonRequest(`/api/notifications/${notificationId}`, {}, { method: "PATCH" });
}

export function subscribeToNotificationInserts(input: {
  organizationId: string;
  userId: string;
  onInsert: (notification: NotificationRecord) => void;
}) {
  const channel = db()
    .channel(`eduverse-notifications:${input.organizationId}:${input.userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        filter: `recipient_user_id=eq.${input.userId}`,
        schema: "public",
        table: "notifications"
      },
      (payload) => {
        const notification = toNotificationRecord(payload.new);
        if (notification.organizationId === input.organizationId) input.onInsert(notification);
      }
    )
    .subscribe();

  return () => {
    void db().removeChannel(channel);
  };
}

export async function loadAssignmentsForClasses(classIds: string[], _userId: string, _canManage: boolean) {
  if (classIds.length === 0) return [];

  const responses = await Promise.all(
    classIds.map((classId) => apiRequest<{ assignments: ClassAssignment[] }>(`/api/classes/${classId}/assignments`))
  );

  return responses
    .flatMap((response) => response.assignments ?? [])
    .sort((left, right) => Date.parse(left.dueAt) - Date.parse(right.dueAt));
}

export async function submitAssignmentText(assignment: ClassAssignment, _userId: string, textResponse: string) {
  const formData = new FormData();
  formData.append("textResponse", textResponse.trim());

  await apiRequest<{ submission: ClassAssignmentSubmission }>(
    `/api/classes/${assignment.classId}/assignments/${assignment.id}/submission`,
    {
      body: formData,
      method: "POST"
    }
  );
}

export async function loadMaterialsForClasses(classIds: string[]) {
  if (classIds.length === 0) return [];

  const responses = await Promise.all(
    classIds.map((classId) => apiRequest<{ materials: ClassMaterial[] }>(`/api/classes/${classId}/materials`))
  );

  return responses
    .flatMap((response) => response.materials ?? [])
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export async function loadMessagesForClass(classId: string) {
  const payload = await apiRequest<{ messages: ChatMessage[] }>(`/api/classes/${classId}/messages`);
  return payload.messages ?? [];
}

export async function sendClassMessage(input: {
  classId: string;
  organizationId: string;
  userId: string;
  role: AppRole;
  content: string;
  kind?: "text" | "announcement";
}) {
  const trimmed = input.content.trim();
  if (!trimmed) return;

  await jsonRequest(
    `/api/classes/${input.classId}/messages`,
    {
      content: trimmed,
      kind: input.kind ?? "text",
      senderRole: input.role
    },
    { method: "POST" }
  );
}

type MaterialDownloadUrlPayload = {
  disposition: "inline" | "attachment";
  downloadUrl?: string;
  expiresIn?: number;
  fileName: string;
  mimeType: string;
  url?: string;
};

export async function loadMaterialDownloadUrl(classId: string, materialId: string, disposition: "inline" | "attachment" = "inline") {
  const payload = await apiRequest<MaterialDownloadUrlPayload>(
    `/api/classes/${classId}/materials/${materialId}/download-url?disposition=${disposition}`
  );
  const url = payload.downloadUrl ?? payload.url;

  if (!url) {
    throw new Error("The Eduverse API did not return a material download URL.");
  }

  return {
    disposition: payload.disposition,
    fileName: payload.fileName,
    mimeType: payload.mimeType,
    url
  };
}

export type MaterialDownloadUrl = {
    disposition: "inline" | "attachment";
    fileName: string;
    mimeType: string;
    url: string;
};

function toAppRole(role?: OrganizationUserRole | null): AppRole {
  if (role === "teacher") return "teacher";
  if (role === "org_owner" || role === "org_admin") return "admin";
  return "student";
}

function toNotificationRecord(row: any): NotificationRecord {
  return {
    body: row.body,
    classId: row.class_id,
    createdAt: row.created_at,
    id: row.id,
    organizationId: row.organization_id,
    readAt: row.read_at,
    title: row.title,
    type: row.type
  };
}
