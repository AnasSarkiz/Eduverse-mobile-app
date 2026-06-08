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
  const Container = onPress ? Pressable : View;

  return (
    <Container className="mb-3 rounded-[26px] border border-border bg-card p-4 shadow-sm dark:border-dark-border dark:bg-dark-card" onPress={onPress}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-black text-foreground dark:text-dark-foreground">{item.title}</Text>
          <Text className="mt-1 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">{item.body}</Text>
        </View>
        {item.unread ? <Badge label="New" /> : null}
      </View>
      <Text className="mt-3 text-[11px] font-black uppercase text-muted-foreground dark:text-dark-muted-foreground">
        {item.category} · {item.time}
      </Text>
    </Container>
  );
}
