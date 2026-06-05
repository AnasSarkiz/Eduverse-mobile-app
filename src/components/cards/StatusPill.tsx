import { Text, View } from "react-native";

type AssignmentStatus = "pending" | "submitted" | "graded" | "overdue";

const statusClassNames: Record<AssignmentStatus, { bg: string; text: string }> = {
  graded: { bg: "bg-emerald-100 dark:bg-emerald-900", text: "text-emerald-700 dark:text-emerald-300" },
  overdue: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-300" },
  pending: { bg: "bg-amber-100 dark:bg-amber-900", text: "text-amber-700 dark:text-amber-300" },
  submitted: { bg: "bg-indigo-100 dark:bg-indigo-950", text: "text-indigo-700 dark:text-indigo-300" }
};

export function StatusPill({ status }: { status: AssignmentStatus }) {
  const classNames = statusClassNames[status];

  return (
    <View className={`rounded-md px-2 py-1 ${classNames.bg}`}>
      <Text className={`text-xs font-bold uppercase ${classNames.text}`}>{status}</Text>
    </View>
  );
}
