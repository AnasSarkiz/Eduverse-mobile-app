import { Text, View } from "react-native";

type SimpleRowProps = {
  title: string;
  meta: string;
  trailing: string;
};

export function SimpleRow({ title, meta, trailing }: SimpleRowProps) {
  return (
    <View className="mb-3 flex-row items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="flex-1">
        <Text className="text-base font-bold text-foreground">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted-foreground">{meta}</Text>
      </View>
      <Text className="text-xs font-bold uppercase text-muted-foreground">{trailing}</Text>
    </View>
  );
}
