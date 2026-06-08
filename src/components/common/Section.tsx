import { Text, View } from "react-native";

type SectionProps = {
  title: string;
  action?: string;
};

export function Section({ title, action }: SectionProps) {
  return (
    <View className="mb-3 mt-7 flex-row items-end justify-between gap-3">
      <Text className="text-[22px] font-black tracking-tight text-foreground dark:text-dark-foreground">{title}</Text>
      {action ? (
        <View className="rounded-full bg-brand-subtle px-3 py-1.5 dark:bg-dark-brand-subtle">
          <Text className="shrink text-right text-[11px] font-black uppercase text-brand-600 dark:text-sky-300">{action}</Text>
        </View>
      ) : null}
    </View>
  );
}
