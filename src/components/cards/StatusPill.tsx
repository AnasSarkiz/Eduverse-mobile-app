import { Text, View } from "react-native";

import type { Assignment } from "@/data/mobileMvp";

const statusClassNames: Record<Assignment["status"], { bg: string; text: string }> = {
  graded: { bg: "bg-emerald-100", text: "text-emerald-700" },
  overdue: { bg: "bg-red-100", text: "text-red-700" },
  pending: { bg: "bg-amber-100", text: "text-amber-700" },
  submitted: { bg: "bg-cyan-100", text: "text-cyan-700" }
};

export function StatusPill({ status }: { status: Assignment["status"] }) {
  const classNames = statusClassNames[status];

  return (
    <View className={`rounded-md px-2 py-1 ${classNames.bg}`}>
      <Text className={`text-xs font-bold uppercase ${classNames.text}`}>{status}</Text>
    </View>
  );
}
