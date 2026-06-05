import { Text, View } from "react-native";
import type { DashboardStat } from "@/data/dashboard";

type StatCardProps = DashboardStat & {
  isFluid?: boolean;
};

const toneClassNames: Record<DashboardStat["tone"], string> = {
  cyan: "border-cyan-100 bg-cyan-50",
  violet: "border-violet-100 bg-violet-50",
  emerald: "border-emerald-100 bg-emerald-50"
};

export function StatCard({ label, value, tone, isFluid = false }: StatCardProps) {
  return (
    <View className={`${isFluid ? "flex-1" : "mb-3"} min-w-28 rounded-lg border px-4 py-3 ${toneClassNames[tone]}`}>
      <Text className="text-2xl font-bold text-ink">{value}</Text>
      <Text className="mt-1 text-xs font-medium uppercase text-slate-500">{label}</Text>
    </View>
  );
}
