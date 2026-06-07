import { Text, View } from "react-native";
import { FileText, Radio } from "lucide-react-native";

import { InfoPanel } from "@/components/cards/InfoPanel";
import { MetricCard, type Metric } from "@/components/cards/MetricCard";
import { NotificationRow } from "@/components/cards/NotificationRow";
import { ActionButton } from "@/components/common/ActionButton";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";

type DashboardScreenProps = {
  isTablet: boolean;
  stats: Metric[];
};

export function DashboardScreen({ stats, isTablet }: DashboardScreenProps) {
  const { activeClass, assignments, joinLiveSession, liveSessions, markRead, notifications, selectClass, user } = useEduverse();
  const nextTask = assignments.find((assignment) => !assignment.mySubmission) ?? assignments[0] ?? null;
  const activeClassIsLive = activeClass ? liveSessions.some((session) => session.class_id === activeClass.id) : false;
  const canStartSession = user?.role === "admin" || user?.role === "teacher";

  return (
    <View>
      <Section title="Today" action="Offline cache ready" />
      <View className="rounded-xl bg-primary p-5">
        <Text className="text-sm font-bold uppercase text-indigo-100">Live or next class</Text>
        <Text className="mt-2 text-2xl font-bold text-white">{activeClass?.name ?? "No active class"}</Text>
        <Text className="mt-1 text-sm text-indigo-100">
          {activeClass ? `${activeClass.schedule_text ?? "No schedule"} · ${activeClass.room ?? "No room"}` : "Join or create classes from the web app."}
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          <ActionButton
            icon={Radio}
            label={activeClassIsLive ? "Join live" : canStartSession ? "Start live" : "Open class"}
            isPrimary={activeClassIsLive || canStartSession}
            onPress={() => {
              if (!activeClass) return;
              if (activeClassIsLive || canStartSession) {
                void joinLiveSession(activeClass.id);
                return;
              }
              void selectClass(activeClass.id);
            }}
          />
          <ActionButton icon={FileText} label="View materials" />
        </View>
      </View>

      <View className={`mt-4 ${isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}`}>
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} isTablet={isTablet} />
        ))}
      </View>

      <Section title="Upcoming" action="Calendar" />
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

      <Section title="Recent activity" />
      {notifications.map((item) => (
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
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
