import { Switch, Text, View } from "react-native";

type SettingRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isTablet: boolean;
};

export function SettingRow({ label, value, onChange, isTablet }: SettingRowProps) {
  return (
    <View
      className="flex-row items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm"
      style={{ width: isTablet ? "31.5%" : "100%" }}
    >
      <Text className="mr-3 flex-1 text-base font-bold text-foreground">{label}</Text>
      <Switch onValueChange={onChange} value={value} />
    </View>
  );
}
