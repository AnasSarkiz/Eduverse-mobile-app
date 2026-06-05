import { Text, View } from "react-native";

type SectionTitleProps = {
  title: string;
  action?: string;
};

export function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-ink">{title}</Text>
      {action ? <Text className="text-sm font-semibold text-brand-600">{action}</Text> : null}
    </View>
  );
}
