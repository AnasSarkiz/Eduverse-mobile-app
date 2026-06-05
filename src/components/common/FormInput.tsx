import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useColorScheme } from "nativewind";

type FormInputProps = {
  label: string;
  value: string;
  secure?: boolean;
};

export function FormInput({ label, value, secure = false }: FormInputProps) {
  const { colorScheme } = useColorScheme();
  const [text, setText] = useState(value);

  return (
    <View className="mb-3">
      <Text className="mb-2 text-sm font-bold text-foreground dark:text-dark-foreground">{label}</Text>
      <TextInput
        className="rounded-md border border-border dark:border-dark-border bg-background dark:bg-dark-background px-4 py-3 text-base text-foreground dark:text-dark-foreground"
        onChangeText={setText}
        placeholder={label}
        placeholderTextColor={colorScheme === "dark" ? "#a1a1aa" : "#94a3b8"}
        secureTextEntry={secure}
        value={text}
      />
    </View>
  );
}
