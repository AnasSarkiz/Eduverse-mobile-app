import { Text, View } from "react-native";

export type Metric = {
  label: string;
  value: string;
  tone: "cyan" | "amber" | "emerald" | "violet";
};

type MetricCardProps = Metric & {
  isTablet: boolean;
};

const toneClassNames: Record<Metric["tone"], string> = {
  amber: "border-amber-100 bg-amber-50",
  cyan: "border-cyan-100 bg-cyan-50",
  emerald: "border-emerald-100 bg-emerald-50",
  violet: "border-violet-100 bg-violet-50"
};

export function MetricCard({ label, value, tone, isTablet }: MetricCardProps) {
  return (
    <View className={`rounded-lg border p-4 ${toneClassNames[tone]}`} style={{ width: isTablet ? "23.5%" : "100%" }}>
      <Text className="text-2xl font-bold text-ink">{value}</Text>
      <Text className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</Text>
    </View>
  );
}
