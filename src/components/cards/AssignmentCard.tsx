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
  const Container = onPress ? Pressable : View;

  return (
    <Container className="rounded-[28px] border border-border bg-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card" onPress={onPress} style={{ width: isTablet ? "48.5%" : "100%" }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-sky-300">{assignment.courseCode}</Text>
          <Text className="mt-2 text-xl font-black text-foreground dark:text-dark-foreground">{assignment.title}</Text>
        </View>
        <StatusPill status={assignment.status} />
      </View>
      <Text className="mt-4 text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground">{assignment.dueLabel}</Text>
      {assignment.score ? <Text className="mt-2 text-sm font-bold text-emerald-600">Score {assignment.score}</Text> : null}
    </Container>
  );
}
