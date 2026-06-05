export type UserRole = "student" | "teacher" | "admin";

export const roleOptions: UserRole[] = ["student", "teacher", "admin"];

export type Profile = {
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  language: string;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  instructor: string;
  schedule: string;
  room: string;
  progress: number;
  liveNow: boolean;
  unreadMessages: number;
  materials: number;
};

export type Assignment = {
  id: string;
  title: string;
  courseCode: string;
  dueLabel: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  score?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  category: "course" | "message" | "deadline" | "announcement";
  time: string;
  unread: boolean;
};

export type ChatThread = {
  id: string;
  title: string;
  subtitle: string;
  lastMessage: string;
  time: string;
  unread: number;
};

export type Announcement = {
  id: string;
  title: string;
  scope: string;
  body: string;
  time: string;
};

export type CalendarItem = {
  id: string;
  title: string;
  meta: string;
  time: string;
};

export type Resource = {
  id: string;
  title: string;
  courseCode: string;
  type: "PDF" | "Video" | "Link" | "Slides";
  cached: boolean;
};

export const profile: Profile = {
  name: "Anas Sarkiz",
  email: "anas@eduverse.local",
  organization: "Eduverse University",
  role: "student",
  language: "English"
};

export const courses: Course[] = [
  {
    id: "cs201",
    code: "CS201",
    title: "Data Structures",
    instructor: "Dr. Lina Omar",
    schedule: "Sun, Tue 14:30",
    room: "Room B12",
    progress: 72,
    liveNow: true,
    unreadMessages: 4,
    materials: 12
  },
  {
    id: "phy110",
    code: "PHY110",
    title: "Physics Lab",
    instructor: "Prof. Kareem Ali",
    schedule: "Mon 09:00",
    room: "Lab 3",
    progress: 58,
    liveNow: false,
    unreadMessages: 1,
    materials: 8
  },
  {
    id: "math220",
    code: "MATH220",
    title: "Discrete Mathematics",
    instructor: "Dr. Sara Naji",
    schedule: "Wed 11:00",
    room: "Room A07",
    progress: 81,
    liveNow: false,
    unreadMessages: 2,
    materials: 10
  }
];

export const assignments: Assignment[] = [
  {
    id: "a1",
    title: "Binary tree worksheet",
    courseCode: "CS201",
    dueLabel: "Today, 23:59",
    status: "pending"
  },
  {
    id: "a2",
    title: "Lab report draft",
    courseCode: "PHY110",
    dueLabel: "Tomorrow, 18:00",
    status: "overdue"
  },
  {
    id: "a3",
    title: "Proof techniques quiz",
    courseCode: "MATH220",
    dueLabel: "Submitted",
    status: "graded",
    score: "92%"
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New assignment",
    body: "CS201 published Binary tree worksheet.",
    category: "deadline",
    time: "09:30",
    unread: true
  },
  {
    id: "n2",
    title: "Teacher reply",
    body: "Dr. Sara replied in Discrete Mathematics chat.",
    category: "message",
    time: "11:15",
    unread: true
  },
  {
    id: "n3",
    title: "Course announcement",
    body: "Physics Lab changed next week location to Lab 2.",
    category: "announcement",
    time: "13:00",
    unread: false
  }
];

export const chatThreads: ChatThread[] = [
  {
    id: "c1",
    title: "CS201 class group",
    subtitle: "Students and teacher",
    lastMessage: "I uploaded the traversal notes.",
    time: "Now",
    unread: 4
  },
  {
    id: "c2",
    title: "Dr. Sara Naji",
    subtitle: "Student-teacher",
    lastMessage: "Good question, check example 3.",
    time: "12:45",
    unread: 1
  },
  {
    id: "c3",
    title: "Eduverse Support",
    subtitle: "Help desk",
    lastMessage: "We can help with account access.",
    time: "Yesterday",
    unread: 0
  }
];

export const announcements: Announcement[] = [
  {
    id: "an1",
    title: "Midterm week schedule",
    scope: "Organization-wide",
    body: "Exam rooms and live session links will be posted this weekend.",
    time: "Pinned"
  },
  {
    id: "an2",
    title: "CS201 review session",
    scope: "Data Structures",
    body: "Optional revision session starts Thursday at 16:00.",
    time: "2h ago"
  }
];

export const calendarItems: CalendarItem[] = [
  {
    id: "cal1",
    title: "Data Structures",
    meta: "Room B12",
    time: "Today 14:30"
  },
  {
    id: "cal2",
    title: "Binary tree worksheet due",
    meta: "CS201 assignment",
    time: "Today 23:59"
  },
  {
    id: "cal3",
    title: "Physics Lab",
    meta: "Lab 3",
    time: "Tomorrow 09:00"
  }
];

export const resources: Resource[] = [
  {
    id: "r1",
    title: "Tree traversal notes",
    courseCode: "CS201",
    type: "PDF",
    cached: true
  },
  {
    id: "r2",
    title: "Lab safety video",
    courseCode: "PHY110",
    type: "Video",
    cached: false
  },
  {
    id: "r3",
    title: "Proof slides",
    courseCode: "MATH220",
    type: "Slides",
    cached: true
  }
];
