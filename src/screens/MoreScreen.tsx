import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import { Section } from "@/components/common/Section";
import { SettingRow } from "@/components/common/SettingRow";
import { useEduverse } from "@/providers/EduverseProvider";

type MoreScreenProps = {
  onSignOut: () => void;
  isTablet: boolean;
};

export function MoreScreen({ onSignOut, isTablet }: MoreScreenProps) {
  const {
    activeOrganization,
    notificationStatus,
    organizations,
    pushNotificationsEnabled,
    selectOrganization,
    setPushNotificationsEnabled,
    user
  } = useEduverse();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  return (
    <View>
      <Section title="Profile" />
      <View className="rounded-[32px] border border-border bg-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
        <Text className="text-2xl font-black text-foreground dark:text-dark-foreground">{user?.name ?? "Eduverse user"}</Text>
        <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">{user?.email ?? ""}</Text>
        <Text className="mt-4 text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-sky-300">
          {activeOrganization?.name ?? user?.institution ?? "No organization"} · {user?.role ?? "student"}
        </Text>
      </View>

      <Section title="Settings" />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        <SettingRow label="Push notifications" value={pushNotificationsEnabled} onChange={(enabled) => void setPushNotificationsEnabled(enabled)} isTablet={isTablet} />
        <SettingRow
          label="Dark theme"
          value={isDarkTheme}
          onChange={(enabled) => setColorScheme(enabled ? "dark" : "light")}
          isTablet={isTablet}
        />
      </View>
      <Text className="mt-3 text-xs leading-5 text-muted-foreground dark:text-dark-muted-foreground">{getNotificationStatusText(notificationStatus)}</Text>

      <Section title="Organizations" />
      <View className="flex-row gap-2">
        {organizations.slice(0, 3).map((organization) => (
          <Pressable
            key={organization.id}
            className={`flex-1 rounded-2xl px-3 py-3 ${activeOrganization?.id === organization.id ? "bg-brand-500" : "bg-card dark:bg-dark-card"}`}
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
      {organizations.length === 0 ? <Text className="text-sm text-muted-foreground dark:text-dark-muted-foreground">No organizations found for this account.</Text> : null}

      <Pressable className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-400/20 dark:bg-red-400/10" onPress={onSignOut}>
        <Text className="text-center text-base font-black text-red-600 dark:text-red-300">Sign out</Text>
      </Pressable>
    </View>
  );
}

function getNotificationStatusText(status: "idle" | "granted" | "denied" | "unavailable") {
  if (status === "granted") return "Device notifications are enabled for realtime Eduverse updates.";
  if (status === "denied") return "Device notifications are blocked in system settings.";
  if (status === "unavailable") return "Device notifications are unavailable on this device.";
  return "Device notification permissions have not been checked yet.";
}
