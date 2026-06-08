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
  amber: "bg-amber-100 dark:bg-amber-400/15",
  emerald: "bg-emerald-100 dark:bg-emerald-400/15",
  indigo: "bg-brand-subtle dark:bg-dark-brand-subtle",
  violet: "bg-violet-100 dark:bg-violet-400/15"
};

const iconColorByTone: Record<Metric["tone"], string> = {
  amber: "#d97706",
  emerald: "#059669",
  indigo: "#4f46e5",
  violet: "#7c3aed"
};

export function MetricCard({ label, value, tone, icon: Icon, isTablet }: MetricCardProps) {
  return (
    <View className="rounded-3xl border border-border bg-card p-4 shadow-sm dark:border-dark-border dark:bg-dark-card" style={{ width: isTablet ? "23.5%" : "48%" }}>
      <View className="gap-4">
        <View className={`h-11 w-11 items-center justify-center rounded-2xl ${toneClassNames[tone]}`}>
          <Icon color={iconColorByTone[tone]} size={18} strokeWidth={2.3} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-bold text-muted-foreground dark:text-dark-muted-foreground">{label}</Text>
          <Text className="mt-1 text-2xl font-black text-foreground dark:text-dark-foreground">{value}</Text>
        </View>
      </View>
    </View>
  );
}
