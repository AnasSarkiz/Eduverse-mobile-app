import { Pressable, Text, View } from "react-native";
import { Bell, GraduationCap } from "lucide-react-native";

import { useEduverse } from "@/providers/EduverseProvider";

export function AppHeader({ onOpenUpdates }: { onOpenUpdates?: () => void }) {
  const { activeOrganization, notifications, organizations, selectOrganization, user } = useEduverse();
  const firstName = user?.name.split(" ")[0] || "there";
  const role = user?.role ?? "student";
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;
  const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);

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
        <View className="items-end gap-2">
          {onOpenUpdates ? (
            <Pressable
              accessibilityLabel={unreadCount ? `${unreadCount} unread updates` : "Open updates"}
              accessibilityRole="button"
              className="relative h-12 w-12 items-center justify-center rounded-3xl bg-card shadow-sm dark:bg-dark-card"
              onPress={onOpenUpdates}
            >
              <Bell color="#4f46e5" size={21} strokeWidth={2.5} />
              {unreadCount ? (
                <View className="absolute -right-1 -top-1 min-w-6 items-center rounded-full bg-emerald-500 px-1.5 py-0.5">
                  <Text className="text-[10px] font-black text-white">{unreadLabel}</Text>
                </View>
              ) : null}
            </Pressable>
          ) : null}
          <View className="rounded-full bg-brand-subtle px-3 py-2 dark:bg-dark-brand-subtle">
            <Text className="text-[11px] font-black uppercase text-brand-600 dark:text-sky-300">{role}</Text>
          </View>
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
