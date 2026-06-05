import type { User } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";

export type OrganizationUserRole = "org_owner" | "org_admin" | "teacher" | "student";
export type AppRole = "admin" | "teacher" | "student";

export type ProfileRecord = {
  id: string;
  email: string;
  display_name: string;
  default_organization_id: string | null;
};

type MembershipRoleRecord = {
  id: string;
  role: OrganizationUserRole;
  status: "active" | "invited" | "suspended";
};

type MembershipRecord = {
  id: string;
  organization_id: string;
  role: OrganizationUserRole;
  status: "active" | "invited" | "suspended";
  selected_role_id: string | null;
  roles: MembershipRoleRecord[];
  organizations?: {
    id: string;
    slug: string;
    name: string;
  } | null;
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
  title: string;
  description: string;
  type: "image" | "pdf" | "video" | "slide";
  originalFilename: string;
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

const ROLE_PRIORITY: OrganizationUserRole[] = ["org_owner", "org_admin", "teacher", "student"];

function db() {
  return getSupabaseClient();
}

export async function getSessionUser() {
  const { data, error } = await db().auth.getUser();
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
  const { data: profileData, error: profileError } = await db()
    .from("profiles")
    .select("id, email, display_name, default_organization_id")
    .eq("id", user.id)
    .single();

  if (profileError) throw profileError;

  const profile = profileData as ProfileRecord;
  const { data: membershipData, error: membershipError } = await db()
    .from("organization_memberships")
    .select("id, organization_id, role, status, selected_role_id, roles:organization_membership_roles(id, role, status), organizations(id, slug, name)")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (membershipError) throw membershipError;

  const organizations = toOrganizations(profile, (membershipData ?? []) as unknown as MembershipRecord[]);
  const activeOrganization =
    organizations.find((organization) => organization.isDefault) ?? organizations[0] ?? null;

  return {
    activeOrganization,
    organizations,
    profile,
    user: toAppUser(profile, activeOrganization)
  };
}

export async function setDefaultOrganization(profileId: string, organizationId: string) {
  const { error } = await db().from("profiles").update({ default_organization_id: organizationId }).eq("id", profileId);
  if (error) throw error;
}

export async function loadOrganizationClasses(organizationId: string) {
  const { data: classData, error: classError } = await db()
    .from("classes")
    .select("id, organization_id, name, code, subject, teacher_user_id, color, description, schedule_text, room, semester, is_archived")
    .eq("organization_id", organizationId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (classError) throw classError;

  return hydrateClasses((classData ?? []) as Omit<OrganizationClass, "memberships" | "teacher">[]);
}

export async function loadNotifications(organizationId: string, userId: string) {
  const { data, error } = await db()
    .from("notifications")
    .select("id, organization_id, class_id, type, title, body, read_at, created_at")
    .eq("organization_id", organizationId)
    .eq("recipient_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) throw error;

  return ((data ?? []) as any[]).map((row): NotificationRecord => ({
    id: row.id,
    organizationId: row.organization_id,
    classId: row.class_id,
    type: row.type,
    title: row.title,
    body: row.body,
    readAt: row.read_at,
    createdAt: row.created_at
  }));
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await db().from("notifications").update({ read_at: new Date().toISOString() }).eq("id", notificationId);
  if (error) throw error;
}

export async function loadAssignmentsForClasses(classIds: string[], userId: string, canManage: boolean) {
  if (classIds.length === 0) return [];

  let assignmentQuery = db()
    .from("class_assignments")
    .select("id, organization_id, class_id, title, description, due_at, max_score, status")
    .in("class_id", classIds)
    .is("deleted_at", null)
    .order("due_at", { ascending: true });

  if (!canManage) assignmentQuery = assignmentQuery.eq("status", "published");

  const { data: assignmentData, error: assignmentError } = await assignmentQuery;
  if (assignmentError) throw assignmentError;

  const assignmentRows = (assignmentData ?? []) as any[];
  const assignmentIds = assignmentRows.map((assignment) => assignment.id);
  const { data: submissionData, error: submissionError } =
    assignmentIds.length > 0
      ? await db()
          .from("class_assignment_submissions")
          .select("id, assignment_id, student_user_id, submitted_at, score, feedback, graded_at")
          .in("assignment_id", assignmentIds)
          .eq("student_user_id", userId)
      : { data: [], error: null };

  if (submissionError) throw submissionError;

  const submissions = new Map(
    ((submissionData ?? []) as any[]).map((row) => [
      row.assignment_id,
      {
        id: row.id,
        assignmentId: row.assignment_id,
        feedback: row.feedback,
        gradedAt: row.graded_at,
        score: row.score,
        studentUserId: row.student_user_id,
        submittedAt: row.submitted_at
      } satisfies ClassAssignmentSubmission
    ])
  );

  return assignmentRows.map(
    (row): ClassAssignment => ({
      id: row.id,
      organizationId: row.organization_id,
      classId: row.class_id,
      description: row.description,
      dueAt: row.due_at,
      maxScore: row.max_score,
      mySubmission: submissions.get(row.id) ?? null,
      status: row.status,
      title: row.title
    })
  );
}

export async function submitAssignmentText(assignment: ClassAssignment, userId: string, textResponse: string) {
  const isLate = Date.parse(assignment.dueAt) < Date.now();
  const { error } = await db().from("class_assignment_submissions").upsert(
    {
      assignment_id: assignment.id,
      class_id: assignment.classId,
      organization_id: assignment.organizationId,
      student_user_id: userId,
      text_response: textResponse.trim(),
      submitted_at: new Date().toISOString(),
      is_late: isLate
    },
    { onConflict: "assignment_id,student_user_id" }
  );
  if (error) throw error;
}

export async function loadMaterialsForClasses(classIds: string[]) {
  if (classIds.length === 0) return [];
  const { data, error } = await db()
    .from("class_materials")
    .select("id, class_id, title, description, type, original_filename, created_at")
    .in("class_id", classIds)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as any[]).map((row): ClassMaterial => ({
    id: row.id,
    classId: row.class_id,
    createdAt: row.created_at,
    description: row.description,
    originalFilename: row.original_filename,
    title: row.title,
    type: row.type
  }));
}

export async function loadMessagesForClass(classId: string) {
  const { data, error } = await db()
    .from("class_messages")
    .select("id, class_id, sender_user_id, sender_role, content, kind, created_at")
    .eq("class_id", classId)
    .order("created_at", { ascending: true })
    .limit(80);

  if (error) throw error;

  const rows = (data ?? []) as any[];
  const senderIds = Array.from(new Set(rows.map((row) => row.sender_user_id)));
  const { data: profileData, error: profileError } =
    senderIds.length > 0
      ? await db().from("profiles").select("id, display_name, email").in("id", senderIds)
      : { data: [], error: null };

  if (profileError) throw profileError;

  const profiles = new Map(((profileData ?? []) as any[]).map((profile) => [profile.id, profile]));

  return rows.map((row): ChatMessage => {
    const sender = profiles.get(row.sender_user_id);
    return {
      id: row.id,
      classId: row.class_id,
      content: row.content,
      createdAt: row.created_at,
      kind: row.kind,
      senderId: row.sender_user_id,
      senderName: sender?.display_name || sender?.email?.split("@")[0] || "Unknown",
      senderRole: row.sender_role
    };
  });
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

  const { error } = await db().from("class_messages").insert({
    class_id: input.classId,
    content: trimmed,
    kind: input.kind ?? "text",
    organization_id: input.organizationId,
    sender_role: input.role,
    sender_user_id: input.userId
  });
  if (error) throw error;
}

function toOrganizations(profile: ProfileRecord, memberships: MembershipRecord[]) {
  return memberships
    .filter((membership) => membership.organizations?.id && membership.status === "active")
    .map((membership): AppOrganization => {
      const organization = Array.isArray(membership.organizations) ? membership.organizations[0] : membership.organizations;
      const activeRoles = (membership.roles?.length ? membership.roles : [{ id: membership.selected_role_id ?? "", role: membership.role, status: membership.status }])
        .filter((role) => role.status === "active")
        .sort((left, right) => roleRank(left.role) - roleRank(right.role));
      const selectedRoleRecord = activeRoles.find((role) => role.id === membership.selected_role_id);
      const selectedRole = selectedRoleRecord?.role ?? activeRoles[0]?.role ?? membership.role;

      return {
        id: organization!.id,
        slug: organization!.slug,
        name: organization!.name,
        membershipId: membership.id,
        roles: activeRoles.map((role) => role.role),
        selectedRole,
        selectedRoleId: selectedRoleRecord?.id ?? activeRoles.find((role) => role.role === selectedRole)?.id ?? null,
        isDefault: profile.default_organization_id === membership.organization_id
      };
    });
}

function toAppUser(profile: ProfileRecord, organization: AppOrganization | null): AppUser {
  return {
    id: profile.id,
    email: profile.email,
    institution: organization?.name ?? "No organization selected",
    name: profile.display_name || profile.email?.split("@")[0] || "User",
    role: toAppRole(organization?.selectedRole)
  };
}

function toAppRole(role?: OrganizationUserRole | null): AppRole {
  if (role === "teacher") return "teacher";
  if (role === "org_owner" || role === "org_admin") return "admin";
  return "student";
}

function roleRank(role: OrganizationUserRole) {
  const index = ROLE_PRIORITY.indexOf(role);
  return index === -1 ? ROLE_PRIORITY.length : index;
}

async function hydrateClasses(classRows: Omit<OrganizationClass, "memberships" | "teacher">[]) {
  if (classRows.length === 0) return [];

  const classIds = classRows.map((classRow) => classRow.id);
  const { data: membershipData, error: membershipError } = await db()
    .from("class_memberships")
    .select("id, class_id, user_id, role")
    .in("class_id", classIds);

  if (membershipError) throw membershipError;

  const memberships = (membershipData ?? []) as ClassMembership[];
  const teacherIds = Array.from(new Set(classRows.flatMap((classRow) => (classRow.teacher_user_id ? [classRow.teacher_user_id] : []))));
  const { data: profileData, error: profileError } =
    teacherIds.length > 0 ? await db().from("profiles").select("id, display_name, email").in("id", teacherIds) : { data: [], error: null };

  if (profileError) throw profileError;

  const profiles = new Map(((profileData ?? []) as any[]).map((profile) => [profile.id, profile]));
  const membershipsByClass = new Map<string, ClassMembership[]>();
  for (const membership of memberships) {
    membershipsByClass.set(membership.class_id, [...(membershipsByClass.get(membership.class_id) ?? []), membership]);
  }

  return classRows.map(
    (classRow): OrganizationClass => ({
      ...classRow,
      memberships: membershipsByClass.get(classRow.id) ?? [],
      teacher: classRow.teacher_user_id ? (profiles.get(classRow.teacher_user_id) ?? null) : null
    })
  );
}
