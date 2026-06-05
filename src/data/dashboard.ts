export type DashboardStat = {
  label: string;
  value: string;
  tone: "cyan" | "violet" | "emerald";
};

export type TimelineItem = {
  title: string;
  detail: string;
  time: string;
};

export type QuickAction = {
  title: string;
  description: string;
};

export const dashboardStats: DashboardStat[] = [
  { label: "Courses", value: "4", tone: "cyan" },
  { label: "Deadlines", value: "3", tone: "violet" },
  { label: "Unread chats", value: "7", tone: "emerald" }
];

export const timeline: TimelineItem[] = [
  {
    title: "Physics lab reminder",
    detail: "Lab report draft is due tonight.",
    time: "09:30"
  },
  {
    title: "New course announcement",
    detail: "Data Structures week 4 notes are available.",
    time: "11:15"
  },
  {
    title: "Teacher message",
    detail: "Your math instructor replied in group chat.",
    time: "13:00"
  }
];

export const quickActions: QuickAction[] = [
  {
    title: "Open notifications",
    description: "Review course updates, deadlines, and announcements."
  },
  {
    title: "Check assignments",
    description: "See what is due soon and what is already submitted."
  },
  {
    title: "Continue chats",
    description: "Keep student, teacher, and class conversations moving."
  }
];
