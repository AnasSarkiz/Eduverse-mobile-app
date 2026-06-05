import { Text, View } from "react-native";

type InfoPanelProps = {
  title: string;
  meta: string;
  value: string;
  isFluid: boolean;
};

export function InfoPanel({ title, meta, value, isFluid }: InfoPanelProps) {
  return (
    <View className="rounded-lg border border-slate-200 bg-white p-4" style={{ flex: isFluid ? 1 : undefined }}>
      <Text className="text-xs font-bold uppercase text-brand-600">{value}</Text>
      <Text className="mt-1 text-base font-bold text-ink">{title}</Text>
      <Text className="mt-1 text-sm leading-5 text-slate-600">{meta}</Text>
    </View>
  );
}
