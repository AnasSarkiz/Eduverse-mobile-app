import { Text, View } from "react-native";

type SectionProps = {
  title: string;
  action?: string;
};

export function Section({ title, action }: SectionProps) {
  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between gap-3">
      <Text className="text-lg font-bold text-ink">{title}</Text>
      {action ? <Text className="shrink text-right text-xs font-bold uppercase text-brand-600">{action}</Text> : null}
    </View>
  );
}
