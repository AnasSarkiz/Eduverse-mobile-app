import { Text, View } from "react-native";
import { FileText, Radio } from "lucide-react-native";

import { InfoPanel } from "@/components/cards/InfoPanel";
import { MetricCard, type Metric } from "@/components/cards/MetricCard";
import { NotificationRow } from "@/components/cards/NotificationRow";
import { ActionButton } from "@/components/common/ActionButton";
import { Section } from "@/components/common/Section";
import { assignments, courses, notifications } from "@/data/mobileMvp";

type DashboardScreenProps = {
  isTablet: boolean;
  stats: Metric[];
};

export function DashboardScreen({ stats, isTablet }: DashboardScreenProps) {
  const nextClass = courses.find((course) => course.liveNow) ?? courses[0];
  const nextTask = assignments.find((assignment) => assignment.status !== "graded") ?? assignments[0];

  return (
    <View>
      <Section title="Today" action="Offline cache ready" />
      <View className="rounded-xl bg-primary p-5">
        <Text className="text-sm font-bold uppercase text-indigo-100">Live or next class</Text>
        <Text className="mt-2 text-2xl font-bold text-white">{nextClass.title}</Text>
        <Text className="mt-1 text-sm text-indigo-100">
          {nextClass.schedule} · {nextClass.room}
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          <ActionButton icon={Radio} label={nextClass.liveNow ? "Join live" : "Open class"} isPrimary />
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
        <InfoPanel title={nextTask.title} meta={`${nextTask.courseCode} · ${nextTask.dueLabel}`} value="Assignment" isFluid={isTablet} />
        <InfoPanel title={notifications[0].title} meta={notifications[0].body} value="Notification" isFluid={isTablet} />
      </View>

      <Section title="Recent activity" />
      {notifications.map((item) => (
        <NotificationRow key={item.id} item={item} />
      ))}
    </View>
  );
}
