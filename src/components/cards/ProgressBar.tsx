import { View } from "react-native";

export function ProgressBar({ value }: { value: number }) {
  return (
    <View className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
      <View className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </View>
  );
}
