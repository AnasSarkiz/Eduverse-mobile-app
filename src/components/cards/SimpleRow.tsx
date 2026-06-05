import { Text, View } from "react-native";

type SimpleRowProps = {
  title: string;
  meta: string;
  trailing: string;
};

export function SimpleRow({ title, meta, trailing }: SimpleRowProps) {
  return (
    <View className="mb-3 flex-row items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <View className="flex-1">
        <Text className="text-base font-bold text-ink">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-600">{meta}</Text>
      </View>
      <Text className="text-xs font-bold uppercase text-slate-400">{trailing}</Text>
    </View>
  );
}
