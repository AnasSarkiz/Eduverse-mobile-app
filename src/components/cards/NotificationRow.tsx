import { Text, View } from "react-native";

import { Badge } from "@/components/common/Badge";
import type { NotificationItem } from "@/data/mobileMvp";

export function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <View className="mb-3 rounded-lg border border-slate-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-ink">{item.title}</Text>
          <Text className="mt-1 text-sm leading-5 text-slate-600">{item.body}</Text>
        </View>
        {item.unread ? <Badge label="New" /> : null}
      </View>
      <Text className="mt-2 text-xs font-semibold uppercase text-slate-400">
        {item.category} · {item.time}
      </Text>
    </View>
  );
}
