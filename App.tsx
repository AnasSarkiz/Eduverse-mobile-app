import "./global.css";

import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, BookOpen, CheckCircle2, Clock, LayoutDashboard, MessageSquare, MoreHorizontal, TrendingUp } from "lucide-react-native";

import { BottomTabs } from "@/components/layout/BottomTabs";
import { EduverseProvider, useEduverse } from "@/providers/EduverseProvider";
import { AuthScreen } from "@/screens/AuthScreen";
import { ChatScreen } from "@/screens/ChatScreen";
import { CoursesScreen } from "@/screens/CoursesScreen";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { LiveSessionScreen } from "@/screens/LiveSessionScreen";
import { MoreScreen } from "@/screens/MoreScreen";
import { TasksScreen } from "@/screens/TasksScreen";
import { UpdatesScreen } from "@/screens/UpdatesScreen";
import type { AuthMode, ScreenKey, TabItem } from "@/types/navigation";

const tabs: TabItem[] = [
  { key: "dashboard", label: "Today", icon: LayoutDashboard },
  { key: "courses", label: "Classes", icon: BookOpen },
  // { key: "tasks", label: "Tasks", icon: CheckCircle2 },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "more", label: "More", icon: MoreHorizontal }
];

export default function App() {
  return (
    <EduverseProvider>
      <AppContent />
    </EduverseProvider>
  );
}

function AppContent() {
  const {
    assignments,
    activeLiveSession,
    classes,
    errorMessage,
    forgotPassword,
    isAuthenticated,
    isLoading,
    notifications,
    selectClass,
    signIn,
    signOutUser,
    signUp,
    user
  } = useEduverse();
  const { width } = useWindowDimensions();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [activeTab, setActiveTab] = useState<ScreenKey>("dashboard");
  const [materialClassRequest, setMaterialClassRequest] = useState<{ classId: string; id: number } | null>(null);
  const isCompact = width < 360;
  const isTablet = width >= 768;
  const contentPadding = isCompact ? 14 : isTablet ? 28 : 20;
  const contentMaxWidth = isTablet ? 820 : undefined;

  const stats = useMemo(
    () => [
      { label: "Classes", value: String(classes.length), tone: "indigo" as const, icon: BookOpen },
      {
        label: "Pending",
        value: String(assignments.filter((assignment) => !assignment.mySubmission).length),
        tone: "amber" as const,
        icon: Clock
      },
      {
        label: "Unread",
        value: String(notifications.filter((item) => !item.readAt).length),
        tone: "emerald" as const,
        icon: Bell
      },
      {
        label: "Progress",
        value: `${getCompletion(assignments)}%`,
        tone: "violet" as const,
        icon: TrendingUp
      }
    ],
    [assignments, classes.length, notifications]
  );

  if (!isAuthenticated) {
    return (
      <AuthScreen
        authMode={authMode}
        contentPadding={contentPadding}
        errorMessage={errorMessage}
        isCompact={isCompact}
        onForgotPassword={forgotPassword}
        onSignIn={signIn}
        onSignUp={signUp}
        setAuthMode={setAuthMode}
      />
    );
  }

  if (isLoading && !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background dark:bg-dark-background">
        <ActivityIndicator color="#4f46e5" />
        <Text className="mt-3 text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground">Loading Eduverse...</Text>
      </SafeAreaView>
    );
  }

  if (activeLiveSession) {
    return <LiveSessionScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <View className="flex-1">
        {activeTab === "chat" ? (
          <View
            className="flex-1"
            style={{
              alignSelf: "center",
              maxWidth: contentMaxWidth,
              paddingBottom: 176,
              paddingHorizontal: contentPadding,
              paddingTop: 12,
              width: "100%"
            }}
          >
            <ChatScreen isTablet={isTablet} />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              alignSelf: "center",
              maxWidth: contentMaxWidth,
              paddingBottom: 176,
              paddingHorizontal: contentPadding,
              paddingTop: 12,
              width: "100%"
            }}
          >
            {activeTab === "dashboard" ? (
              <DashboardScreen
                stats={stats}
                isTablet={isTablet}
                onOpenClass={(classId) => {
                  void selectClass(classId);
                  setActiveTab("chat");
                }}
                onOpenMaterials={(classId) => {
                  setMaterialClassRequest({ classId, id: Date.now() });
                  setActiveTab("courses");
                }}
                onOpenUpdates={() => setActiveTab("updates")}
              />
            ) : null}
            {activeTab === "courses" ? <CoursesScreen isTablet={isTablet} materialClassRequest={materialClassRequest} /> : null}
            {activeTab === "tasks" ? <TasksScreen isTablet={isTablet} /> : null}
            {activeTab === "more" ? <MoreScreen onSignOut={signOutUser} isTablet={isTablet} /> : null}
            {activeTab === "updates" ? <UpdatesScreen isTablet={isTablet} onBack={() => setActiveTab("dashboard")} /> : null}
          </ScrollView>
        )}

        <BottomTabs activeTab={activeTab} contentMaxWidth={contentMaxWidth} onChangeTab={setActiveTab} tabs={tabs} />
      </View>
    </SafeAreaView>
  );
}

function getCompletion(assignments: { mySubmission: unknown }[]) {
  if (assignments.length === 0) return 0;
  return Math.round((assignments.filter((assignment) => assignment.mySubmission).length / assignments.length) * 100);
}
