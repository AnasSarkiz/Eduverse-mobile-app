import { Text, View } from "react-native";

type InfoPanelProps = {
  title: string;
  meta: string;
  value: string;
  isFluid: boolean;
};

export function InfoPanel({ title, meta, value, isFluid }: InfoPanelProps) {
  return (
    <View className="rounded-xl border border-border bg-card p-4 shadow-sm" style={{ flex: isFluid ? 1 : undefined }}>
      <Text className="text-xs font-bold uppercase text-brand-600">{value}</Text>
      <Text className="mt-1 text-base font-bold text-foreground">{title}</Text>
      <Text className="mt-1 text-sm leading-5 text-muted-foreground">{meta}</Text>
    </View>
  );
}
