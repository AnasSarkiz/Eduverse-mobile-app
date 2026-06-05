import { Pressable, Text, View } from "react-native";

import { Badge } from "@/components/common/Badge";

type NotificationRowItem = {
  id: string;
  title: string;
  body: string;
  category: "course" | "message" | "deadline" | "announcement";
  time: string;
  unread: boolean;
};

export function NotificationRow({ item, onPress }: { item: NotificationRowItem; onPress?: () => void }) {
  return (
    <Pressable className="mb-3 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 shadow-sm" onPress={onPress}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground dark:text-dark-foreground">{item.title}</Text>
          <Text className="mt-1 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">{item.body}</Text>
        </View>
        {item.unread ? <Badge label="New" /> : null}
      </View>
      <Text className="mt-2 text-xs font-semibold uppercase text-muted-foreground dark:text-dark-muted-foreground">
        {item.category} · {item.time}
      </Text>
    </Pressable>
  );
}
