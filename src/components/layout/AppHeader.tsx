import { Pressable, Text, View } from "react-native";
import { GraduationCap } from "lucide-react-native";

import { useEduverse } from "@/providers/EduverseProvider";

export function AppHeader() {
  const { activeOrganization, organizations, selectOrganization, user } = useEduverse();
  const firstName = user?.name.split(" ")[0] || "there";
  const role = user?.role ?? "student";

  return (
    <View className="mb-6">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-3xl bg-brand-500">
            <GraduationCap color="#ffffff" size={25} strokeWidth={2.5} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-sky-300" numberOfLines={1}>
              {activeOrganization?.name ?? user?.institution ?? "Eduverse"}
            </Text>
            <Text className="mt-1 text-[30px] font-black tracking-tight text-foreground dark:text-dark-foreground" numberOfLines={1}>
              Hi, {firstName}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">
              Your classes, messages, tasks, and materials in one place.
            </Text>
          </View>
        </View>
        <View className="rounded-full bg-brand-subtle px-3 py-2 dark:bg-dark-brand-subtle">
          <Text className="text-[11px] font-black uppercase text-brand-600 dark:text-sky-300">{role}</Text>
        </View>
      </View>

      {organizations.length > 1 ? (
        <View className="mt-5 flex-row gap-2 rounded-3xl bg-muted p-1.5 dark:bg-dark-muted">
        {organizations.slice(0, 3).map((organization) => (
          <Pressable
            key={organization.id}
            className={`flex-1 rounded-2xl px-3 py-2.5 ${activeOrganization?.id === organization.id ? "bg-card dark:bg-dark-card" : "bg-transparent"}`}
            onPress={() => selectOrganization(organization.id)}
          >
            <Text
              className={`text-center text-xs font-bold uppercase ${
                activeOrganization?.id === organization.id ? "text-brand-600 dark:text-sky-300" : "text-muted-foreground dark:text-dark-muted-foreground"
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
