import { Switch, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

type SettingRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isTablet: boolean;
};

export function SettingRow({ label, value, onChange, isTablet }: SettingRowProps) {
  const { colorScheme } = useColorScheme();
  const thumbColor = value ? "#ffffff" : colorScheme === "dark" ? "#a1a1aa" : "#f4f4f5";

  return (
    <View
      className="flex-row items-center justify-between rounded-3xl border border-border bg-card p-4 shadow-sm dark:border-dark-border dark:bg-dark-card"
      style={{ width: isTablet ? "48.5%" : "100%" }}
    >
      <Text className="mr-3 flex-1 text-base font-black text-foreground dark:text-dark-foreground">{label}</Text>
      <Switch
        ios_backgroundColor={colorScheme === "dark" ? "#2a2d3d" : "#e4e4e7"}
        onValueChange={onChange}
        thumbColor={thumbColor}
        trackColor={{ false: colorScheme === "dark" ? "#2a2d3d" : "#e4e4e7", true: "#4f46e5" }}
        value={value}
      />
    </View>
  );
}
