import { Text, View } from "react-native";
import type { TimelineItem } from "@/data/dashboard";

type TimelineItemCardProps = TimelineItem & {
  isFluid?: boolean;
};

export function TimelineItemCard({ title, detail, time, isFluid = false }: TimelineItemCardProps) {
  return (
    <View className="mb-3 rounded-lg border border-slate-200 bg-white p-4" style={{ width: isFluid ? "48.5%" : "100%" }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-ink">{title}</Text>
          <Text className="mt-1 text-sm leading-5 text-slate-600">{detail}</Text>
        </View>
        <Text className="text-xs font-semibold text-slate-400">{time}</Text>
      </View>
    </View>
  );
}
