import { Pressable, Text, View } from "react-native";

type SimpleRowProps = {
  title: string;
  meta: string;
  trailing: string;
  onPress?: () => void;
};

export function SimpleRow({ title, meta, trailing, onPress }: SimpleRowProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container className="mb-3 flex-row items-start justify-between gap-3 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 shadow-sm" onPress={onPress}>
      <View className="flex-1">
        <Text className="text-base font-bold text-foreground dark:text-dark-foreground">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">{meta}</Text>
      </View>
      <Text className="text-xs font-bold uppercase text-muted-foreground dark:text-dark-muted-foreground">{trailing}</Text>
    </Container>
  );
}
