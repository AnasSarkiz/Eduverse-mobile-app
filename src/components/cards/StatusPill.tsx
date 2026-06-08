import { Text, View } from "react-native";

type AssignmentStatus = "pending" | "submitted" | "graded" | "overdue";

const statusClassNames: Record<AssignmentStatus, { bg: string; text: string }> = {
  graded: { bg: "bg-emerald-100 dark:bg-emerald-400/15", text: "text-emerald-700 dark:text-emerald-300" },
  overdue: { bg: "bg-red-100 dark:bg-red-400/15", text: "text-red-700 dark:text-red-300" },
  pending: { bg: "bg-amber-100 dark:bg-amber-400/15", text: "text-amber-700 dark:text-amber-300" },
  submitted: { bg: "bg-brand-subtle dark:bg-dark-brand-subtle", text: "text-brand-600 dark:text-sky-300" }
};

export function StatusPill({ status }: { status: AssignmentStatus }) {
  const classNames = statusClassNames[status];

  return (
    <View className={`rounded-full px-2.5 py-1 ${classNames.bg}`}>
      <Text className={`text-[11px] font-black uppercase ${classNames.text}`}>{status}</Text>
    </View>
  );
}
