import { Pressable, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";

type ActionButtonProps = {
  label: string;
  isPrimary?: boolean;
  icon?: LucideIcon;
  onPress?: () => void;
};

export function ActionButton({ label, isPrimary = false, icon: Icon, onPress }: ActionButtonProps) {
  const { colorScheme } = useColorScheme();
  const inactiveIconColor = colorScheme === "dark" ? "#a1a1aa" : "#71717a";
  const isDisabled = !onPress;

  return (
    <Pressable
      accessibilityState={{ disabled: isDisabled }}
      className={`min-h-10 flex-row items-center gap-2 rounded-2xl px-3.5 py-2.5 ${isPrimary ? "bg-brand-500" : "bg-muted dark:bg-dark-muted"} ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      onPress={onPress}
    >
      {Icon ? <Icon color={isPrimary ? "#ffffff" : inactiveIconColor} size={15} strokeWidth={2.5} /> : null}
      <Text className={`text-xs font-black ${isPrimary ? "text-white" : "text-muted-foreground dark:text-dark-muted-foreground"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
