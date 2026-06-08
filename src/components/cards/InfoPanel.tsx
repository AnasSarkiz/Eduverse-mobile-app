import { Text, View } from "react-native";

type InfoPanelProps = {
  title: string;
  meta: string;
  value: string;
  isFluid: boolean;
};

export function InfoPanel({ title, meta, value, isFluid }: InfoPanelProps) {
  return (
    <View className="rounded-3xl border border-border bg-card p-4 shadow-sm dark:border-dark-border dark:bg-dark-card" style={{ flex: isFluid ? 1 : undefined }}>
      <Text className="text-[11px] font-black uppercase text-brand-600 dark:text-sky-300">{value}</Text>
      <Text className="mt-2 text-lg font-black text-foreground dark:text-dark-foreground" numberOfLines={2}>{title}</Text>
      <Text className="mt-2 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">{meta}</Text>
    </View>
  );
}
