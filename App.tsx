import "./global.css";

import { useMemo, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, BookOpen, CheckCircle2, Clock, LayoutDashboard, MessageSquare, MoreHorizontal, TrendingUp } from "lucide-react-native";

import { BottomTabs } from "@/components/layout/BottomTabs";
import { AppHeader } from "@/components/layout/AppHeader";
import { assignments, courses, notifications, profile, type UserRole } from "@/data/mobileMvp";
import { AuthScreen } from "@/screens/AuthScreen";
import { ChatScreen } from "@/screens/ChatScreen";
import { CoursesScreen } from "@/screens/CoursesScreen";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { MoreScreen } from "@/screens/MoreScreen";
import { TasksScreen } from "@/screens/TasksScreen";
import type { AuthMode, ScreenKey, TabItem } from "@/types/navigation";

const tabs: TabItem[] = [
  { key: "dashboard", label: "Today", icon: LayoutDashboard },
  { key: "courses", label: "Classes", icon: BookOpen },
  { key: "tasks", label: "Tasks", icon: CheckCircle2 },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "more", label: "More", icon: MoreHorizontal }
];

export default function App() {
  const { width } = useWindowDimensions();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [activeTab, setActiveTab] = useState<ScreenKey>("dashboard");
  const [role, setRole] = useState<UserRole>(profile.role);
  const isCompact = width < 360;
  const isTablet = width >= 768;
  const contentPadding = isCompact ? 14 : isTablet ? 28 : 20;
  const contentMaxWidth = isTablet ? 820 : undefined;

  const stats = useMemo(
    () => [
      { label: "Classes", value: String(courses.length), tone: "indigo" as const, icon: BookOpen },
      {
        label: "Pending",
        value: String(assignments.filter((assignment) => ["pending", "overdue"].includes(assignment.status)).length),
        tone: "amber" as const,
        icon: Clock
      },
      {
        label: "Unread",
        value: String(notifications.filter((item) => item.unread).length),
        tone: "emerald" as const,
        icon: Bell
      },
      {
        label: "Progress",
        value: `${Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%`,
        tone: "violet" as const,
        icon: TrendingUp
      }
    ],
    []
  );

  if (!isAuthenticated) {
    return (
      <AuthScreen
        authMode={authMode}
        contentPadding={contentPadding}
        isCompact={isCompact}
        onAuthenticate={() => setIsAuthenticated(true)}
        setAuthMode={setAuthMode}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignSelf: "center",
            maxWidth: contentMaxWidth,
            paddingBottom: 104,
            paddingHorizontal: contentPadding,
            paddingTop: 12,
            width: "100%"
          }}
        >
          <AppHeader role={role} setRole={setRole} />
          {activeTab === "dashboard" ? <DashboardScreen stats={stats} isTablet={isTablet} /> : null}
          {activeTab === "courses" ? <CoursesScreen isTablet={isTablet} /> : null}
          {activeTab === "tasks" ? <TasksScreen isTablet={isTablet} /> : null}
          {activeTab === "chat" ? <ChatScreen isTablet={isTablet} /> : null}
          {activeTab === "more" ? (
            <MoreScreen role={role} setRole={setRole} onSignOut={() => setIsAuthenticated(false)} isTablet={isTablet} />
          ) : null}
        </ScrollView>

        <BottomTabs activeTab={activeTab} contentMaxWidth={contentMaxWidth} onChangeTab={setActiveTab} tabs={tabs} />
      </View>
    </SafeAreaView>
  );
}
