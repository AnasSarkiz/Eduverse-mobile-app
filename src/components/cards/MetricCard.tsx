import { Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

export type Metric = {
  label: string;
  value: string;
  tone: "indigo" | "amber" | "emerald" | "violet";
  icon: LucideIcon;
};

type MetricCardProps = Metric & {
  isTablet: boolean;
};

const toneClassNames: Record<Metric["tone"], string> = {
  amber: "border-amber-100 bg-amber-50",
  emerald: "border-emerald-100 bg-emerald-50",
  indigo: "border-indigo-100 bg-indigo-50",
  violet: "border-violet-100 bg-violet-50"
};

const iconColorByTone: Record<Metric["tone"], string> = {
  amber: "#d97706",
  emerald: "#059669",
  indigo: "#4f46e5",
  violet: "#7c3aed"
};

export function MetricCard({ label, value, tone, icon: Icon, isTablet }: MetricCardProps) {
  return (
    <View className="rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 shadow-sm" style={{ width: isTablet ? "23.5%" : "100%" }}>
      <View className="flex-row items-center gap-3">
        <View className={`h-9 w-9 items-center justify-center rounded-lg ${toneClassNames[tone]}`}>
          <Icon color={iconColorByTone[tone]} size={18} strokeWidth={2.3} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-xs text-muted-foreground dark:text-dark-muted-foreground">{label}</Text>
          <Text className="mt-0.5 text-xl font-bold text-foreground dark:text-dark-foreground">{value}</Text>
        </View>
      </View>
    </View>
  );
}
