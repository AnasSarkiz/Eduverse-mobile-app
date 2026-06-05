import { Text, View } from "react-native";

export function Badge({ label }: { label: string }) {
  return (
    <View className="rounded-md bg-emerald-100 px-2 py-1 dark:bg-emerald-900">
      <Text className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">{label}</Text>
    </View>
  );
}
