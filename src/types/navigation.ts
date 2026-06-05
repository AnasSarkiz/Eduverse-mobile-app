import type { LucideIcon } from "lucide-react-native";

export type ScreenKey = "dashboard" | "courses" | "tasks" | "chat" | "more";

export type AuthMode = "login" | "signup" | "forgot";

export type TabItem = {
  key: ScreenKey;
  label: string;
  icon: LucideIcon;
};
