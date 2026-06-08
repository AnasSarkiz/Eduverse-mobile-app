import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useColorScheme } from "nativewind";

type FormInputProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  secure?: boolean;
  surface?: "default" | "light" | "dark";
};

export function FormInput({ label, value, onChangeText, secure = false, surface = "default" }: FormInputProps) {
  const { colorScheme } = useColorScheme();
  const [text, setText] = useState(value);
  const currentValue = onChangeText ? value : text;
  const isLightSurface = surface === "light";
  const isDarkSurface = surface === "dark";

  return (
    <View className="mb-3">
      <Text
        className={`mb-2 text-sm font-bold ${
          isLightSurface ? "text-slate-700" : isDarkSurface ? "text-slate-100" : "text-foreground dark:text-dark-foreground"
        }`}
      >
        {label}
      </Text>
      <TextInput
        className={
          isLightSurface
            ? "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-950"
            : isDarkSurface
              ? "rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white"
            : "rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground dark:border-dark-border dark:bg-dark-background dark:text-dark-foreground"
        }
        onChangeText={(nextText) => {
          setText(nextText);
          onChangeText?.(nextText);
        }}
        placeholder={label}
        placeholderTextColor={isLightSurface ? "#94a3b8" : isDarkSurface ? "#64748b" : colorScheme === "dark" ? "#a1a1aa" : "#94a3b8"}
        secureTextEntry={secure}
        value={currentValue}
      />
    </View>
  );
}
