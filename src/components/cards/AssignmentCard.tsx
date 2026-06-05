import { Pressable, Text, View } from "react-native";

import { StatusPill } from "@/components/cards/StatusPill";

type AssignmentCardItem = {
  id: string;
  courseCode: string;
  dueLabel: string;
  score?: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  title: string;
};

type AssignmentCardProps = {
  assignment: AssignmentCardItem;
  isTablet: boolean;
  onPress?: () => void;
};

export function AssignmentCard({ assignment, isTablet, onPress }: AssignmentCardProps) {
  return (
    <Pressable className="rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 shadow-sm" onPress={onPress} style={{ width: isTablet ? "48.5%" : "100%" }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-bold uppercase text-brand-600">{assignment.courseCode}</Text>
          <Text className="mt-1 text-lg font-bold text-foreground dark:text-dark-foreground">{assignment.title}</Text>
        </View>
        <StatusPill status={assignment.status} />
      </View>
      <Text className="mt-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">{assignment.dueLabel}</Text>
      {assignment.score ? <Text className="mt-2 text-sm font-bold text-emerald-600">Score {assignment.score}</Text> : null}
    </Pressable>
  );
}
