import { Pressable, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";

type ActionButtonProps = {
  label: string;
  isPrimary?: boolean;
  icon?: LucideIcon;
};

export function ActionButton({ label, isPrimary = false, icon: Icon }: ActionButtonProps) {
  const { colorScheme } = useColorScheme();
  const inactiveIconColor = colorScheme === "dark" ? "#a1a1aa" : "#71717a";

  return (
    <Pressable className={`flex-row items-center gap-1.5 rounded-md px-3 py-2 ${isPrimary ? "bg-brand-500" : "bg-muted dark:bg-dark-muted"}`}>
      {Icon ? <Icon color={isPrimary ? "#ffffff" : inactiveIconColor} size={14} strokeWidth={2.4} /> : null}
      <Text className={`text-xs font-bold ${isPrimary ? "text-white" : "text-muted-foreground dark:text-dark-muted-foreground"}`}>{label}</Text>
    </Pressable>
  );
}
