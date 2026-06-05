import { useState } from "react";
import { Text, TextInput, View } from "react-native";

type FormInputProps = {
  label: string;
  value: string;
  secure?: boolean;
};

export function FormInput({ label, value, secure = false }: FormInputProps) {
  const [text, setText] = useState(value);

  return (
    <View className="mb-3">
      <Text className="mb-2 text-sm font-bold text-foreground">{label}</Text>
      <TextInput
        className="rounded-md border border-border bg-background px-4 py-3 text-base text-foreground"
        onChangeText={setText}
        placeholder={label}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secure}
        value={text}
      />
    </View>
  );
}
