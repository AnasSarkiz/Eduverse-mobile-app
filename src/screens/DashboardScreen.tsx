import { Text, View } from "react-native";
import { Bell, FileText, Radio } from "lucide-react-native";

import { InfoPanel } from "@/components/cards/InfoPanel";
import { MetricCard, type Metric } from "@/components/cards/MetricCard";
import { NotificationRow } from "@/components/cards/NotificationRow";
import { AppHeader } from "@/components/layout/AppHeader";
import { ActionButton } from "@/components/common/ActionButton";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";

type DashboardScreenProps = {
  isTablet: boolean;
  onOpenClass: (classId: string) => void;
  onOpenMaterials: (classId: string) => void;
  onOpenUpdates: () => void;
  stats: Metric[];
};

export function DashboardScreen({ stats, isTablet, onOpenClass, onOpenMaterials, onOpenUpdates }: DashboardScreenProps) {
  const { activeClass, assignments, joinLiveSession, liveSessions, markRead, notifications, user } = useEduverse();
  const nextTask = assignments.find((assignment) => !assignment.mySubmission) ?? assignments[0] ?? null;
  const activeClassIsLive = activeClass ? liveSessions.some((session) => session.class_id === activeClass.id) : false;
  const canStartSession = user?.role === "admin" || user?.role === "teacher";
  const recentNotifications = notifications.slice(0, 3);

  return (
    <View>
      <AppHeader onOpenUpdates={onOpenUpdates} />
      <Section title="Today" action={activeClass ? "Class ready" : "No class"} />
      <View className="overflow-hidden rounded-[32px] bg-brand-500 p-6 dark:bg-brand-700">
        <Text className="text-[11px] font-black uppercase tracking-widest text-blue-100">Live or next class</Text>
        <Text className="mt-3 text-3xl font-black tracking-tight text-white">{activeClass?.name ?? "No active class"}</Text>
        <Text className="mt-2 text-sm font-semibold leading-6 text-blue-100">
          {activeClass ? `${activeClass.schedule_text ?? "No schedule"} · ${activeClass.room ?? "No room"}` : "Join or create classes from the web app."}
        </Text>
        {activeClass ? (
          <View className="mt-4 flex-row flex-wrap gap-2">
            <ActionButton
              icon={Radio}
              label={activeClassIsLive ? "Join live" : canStartSession ? "Start live" : "Class chat"}
              isPrimary={activeClassIsLive || canStartSession}
              onPress={() => {
                if (activeClassIsLive || canStartSession) {
                  void joinLiveSession(activeClass.id);
                  return;
                }
                onOpenClass(activeClass.id);
              }}
            />
            <ActionButton icon={FileText} label="Materials" onPress={() => onOpenMaterials(activeClass.id)} />
          </View>
        ) : null}
      </View>

      <View className="mt-4 flex-row flex-wrap gap-3">
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} isTablet={isTablet} />
        ))}
      </View>

      <Section title="Upcoming" action={assignments.length ? `${assignments.length} tasks` : "Clear"} />
      <View className={isTablet ? "flex-row gap-3" : "gap-3"}>
        <InfoPanel
          title={nextTask?.title ?? "No pending assignments"}
          meta={nextTask ? formatDate(nextTask.dueAt) : "You are all caught up."}
          value="Assignment"
          isFluid={isTablet}
        />
        <InfoPanel
          title={notifications[0]?.title ?? "No notifications"}
          meta={notifications[0]?.body ?? "New updates will appear here."}
          value="Notification"
          isFluid={isTablet}
        />
      </View>

      <Section title="Recent activity" action={notifications.length ? `${notifications.length} updates` : undefined} />
      {recentNotifications.map((item) => (
        <NotificationRow
          key={item.id}
          item={{
            id: item.id,
            body: item.body,
            category: item.type.includes("assignment") ? "deadline" : item.type.includes("announcement") ? "announcement" : "course",
            time: formatDate(item.createdAt),
            title: item.title,
            unread: !item.readAt
          }}
          onPress={() => markRead(item.id)}
        />
      ))}
      {notifications.length === 0 ? <Text className="text-sm text-muted-foreground dark:text-dark-muted-foreground">No recent activity yet.</Text> : null}
      {notifications.length > recentNotifications.length ? (
        <View className="mt-1 flex-row">
          <ActionButton icon={Bell} label="View all updates" onPress={onOpenUpdates} />
        </View>
      ) : null}
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
