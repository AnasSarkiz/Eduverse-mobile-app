import { Pressable, Text, View } from "react-native";
import { GraduationCap } from "lucide-react-native";

import { useEduverse } from "@/providers/EduverseProvider";

export function AppHeader() {
  const { activeOrganization, organizations, selectOrganization, user } = useEduverse();
  const firstName = user?.name.split(" ")[0] || "there";
  const role = user?.role ?? "student";

  return (
    <View className="mb-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
            <GraduationCap color="#ffffff" size={20} strokeWidth={2.4} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold uppercase text-brand-600">{activeOrganization?.name ?? user?.institution ?? "Eduverse"}</Text>
            <Text className="mt-1 text-2xl font-bold text-foreground dark:text-dark-foreground">Hi, {firstName}</Text>
            <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">Daily workspace synced for weak internet and quick checks.</Text>
          </View>
        </View>
        <View className="rounded-md bg-brand-subtle dark:bg-dark-brand-subtle px-3 py-2">
          <Text className="text-xs font-bold uppercase text-muted-foreground dark:text-dark-muted-foreground">{role}</Text>
        </View>
      </View>

      {organizations.length > 1 ? (
        <View className="mt-4 flex-row gap-2">
        {organizations.slice(0, 3).map((organization) => (
          <Pressable
            key={organization.id}
            className={`flex-1 rounded-md px-3 py-2 ${activeOrganization?.id === organization.id ? "bg-brand-500" : "bg-card dark:bg-dark-card"}`}
            onPress={() => selectOrganization(organization.id)}
          >
            <Text
              className={`text-center text-xs font-bold uppercase ${
                activeOrganization?.id === organization.id ? "text-white" : "text-muted-foreground dark:text-dark-muted-foreground"
              }`}
              numberOfLines={1}
            >
              {organization.name}
            </Text>
          </Pressable>
        ))}
        </View>
      ) : null}
    </View>
  );
}
