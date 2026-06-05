import { Pressable, Text, View } from "react-native";

import { profile, roleOptions, type UserRole } from "@/data/mobileMvp";

type AppHeaderProps = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

export function AppHeader({ role, setRole }: AppHeaderProps) {
  return (
    <View className="mb-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-bold uppercase text-brand-600">{profile.organization}</Text>
          <Text className="mt-1 text-2xl font-bold text-ink">Hi, {profile.name.split(" ")[0]}</Text>
          <Text className="mt-1 text-sm text-slate-500">Daily workspace synced for weak internet and quick checks.</Text>
        </View>
        <View className="rounded-md bg-white px-3 py-2">
          <Text className="text-xs font-bold uppercase text-slate-500">{role}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row gap-2">
        {roleOptions.map((option) => (
          <Pressable
            key={option}
            className={`flex-1 rounded-md px-3 py-2 ${role === option ? "bg-ink" : "bg-white"}`}
            onPress={() => setRole(option)}
          >
            <Text className={`text-center text-xs font-bold uppercase ${role === option ? "text-white" : "text-slate-500"}`}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
