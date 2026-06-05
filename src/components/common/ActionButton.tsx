import { Pressable, Text } from "react-native";

type ActionButtonProps = {
  label: string;
  isPrimary?: boolean;
};

export function ActionButton({ label, isPrimary = false }: ActionButtonProps) {
  return (
    <Pressable className={`rounded-md px-3 py-2 ${isPrimary ? "bg-brand-500" : "bg-slate-100"}`}>
      <Text className={`text-xs font-bold ${isPrimary ? "text-white" : "text-slate-600"}`}>{label}</Text>
    </Pressable>
  );
}
