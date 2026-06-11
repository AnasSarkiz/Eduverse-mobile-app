import type { LucideIcon } from "lucide-react-native";

export type TabKey = "dashboard" | "courses" | "tasks" | "chat" | "more";
export type ScreenKey = TabKey | "updates";

export type AuthMode = "login" | "signup" | "forgot";

export type TabItem = {
  key: TabKey;
  label: string;
  icon: LucideIcon;
};
