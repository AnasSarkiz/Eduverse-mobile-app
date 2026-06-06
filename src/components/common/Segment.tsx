import { Pressable, Text } from "react-native";

type SegmentProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

export function Segment({ label, isActive, onPress }: SegmentProps) {
  return (
    <Pressable className={`flex-1 rounded-full px-3 py-3 ${isActive ? "bg-sky-500" : "bg-transparent"}`} onPress={onPress}>
      <Text className={`text-center text-sm font-bold ${isActive ? "text-white" : "text-slate-400"}`}>{label}</Text>
    </Pressable>
  );
}
