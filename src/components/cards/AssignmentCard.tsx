import { Text, View } from "react-native";

import { StatusPill } from "@/components/cards/StatusPill";
import type { Assignment } from "@/data/mobileMvp";

type AssignmentCardProps = {
  assignment: Assignment;
  isTablet: boolean;
};

export function AssignmentCard({ assignment, isTablet }: AssignmentCardProps) {
  return (
    <View className="rounded-xl border border-border bg-card p-4 shadow-sm" style={{ width: isTablet ? "48.5%" : "100%" }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-bold uppercase text-brand-600">{assignment.courseCode}</Text>
          <Text className="mt-1 text-lg font-bold text-foreground">{assignment.title}</Text>
        </View>
        <StatusPill status={assignment.status} />
      </View>
      <Text className="mt-3 text-sm text-muted-foreground">{assignment.dueLabel}</Text>
      {assignment.score ? <Text className="mt-2 text-sm font-bold text-emerald-600">Score {assignment.score}</Text> : null}
    </View>
  );
}
