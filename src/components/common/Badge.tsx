import { Text, View } from "react-native";

export function Badge({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-emerald-100 px-2.5 py-1 dark:bg-emerald-400/15">
      <Text className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-300">{label}</Text>
    </View>
  );
}
