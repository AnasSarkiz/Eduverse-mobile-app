import { Pressable, Text, View } from "react-native";
import { GraduationCap } from "lucide-react-native";

import { profile, roleOptions, type UserRole } from "@/data/mobileMvp";

type AppHeaderProps = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

export function AppHeader({ role, setRole }: AppHeaderProps) {
  return (
    <View className="mb-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
            <GraduationCap color="#ffffff" size={20} strokeWidth={2.4} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold uppercase text-brand-600">{profile.organization}</Text>
            <Text className="mt-1 text-2xl font-bold text-foreground dark:text-dark-foreground">Hi, {profile.name.split(" ")[0]}</Text>
            <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">Daily workspace synced for weak internet and quick checks.</Text>
          </View>
        </View>
        <View className="rounded-md bg-brand-subtle dark:bg-dark-brand-subtle px-3 py-2">
          <Text className="text-xs font-bold uppercase text-muted-foreground dark:text-dark-muted-foreground">{role}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row gap-2">
        {roleOptions.map((option) => (
          <Pressable
            key={option}
            className={`flex-1 rounded-md px-3 py-2 ${role === option ? "bg-primary" : "bg-card dark:bg-dark-card"}`}
            onPress={() => setRole(option)}
          >
            <Text className={`text-center text-xs font-bold uppercase ${role === option ? "text-white" : "text-muted-foreground dark:text-dark-muted-foreground"}`}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
