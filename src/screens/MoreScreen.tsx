import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useColorScheme } from "nativewind";

import { SimpleRow } from "@/components/cards/SimpleRow";
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
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const isDarkTheme = colorScheme === "dark";

  return (
    <View>
      <Section title="Profile" action="Account" />
      <View className="rounded-xl bg-card dark:bg-dark-card p-4 shadow-sm">
        <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">{user?.name ?? "Eduverse user"}</Text>
        <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">{user?.email ?? ""}</Text>
        <Text className="mt-3 text-xs font-bold uppercase text-brand-600">
          {activeOrganization?.name ?? user?.institution ?? "No organization"} · {user?.role ?? "student"}
        </Text>
      </View>

      <Section title="Settings" action="Preferences" />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        <SettingRow label="Push notifications" value={pushNotificationsEnabled} onChange={(enabled) => void setPushNotificationsEnabled(enabled)} isTablet={isTablet} />
        <SettingRow label="Offline basics" value={offlineEnabled} onChange={setOfflineEnabled} isTablet={isTablet} />
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
            className={`flex-1 rounded-md px-3 py-3 ${activeOrganization?.id === organization.id ? "bg-brand-500" : "bg-card dark:bg-dark-card"}`}
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

      <Section title="Search" action="Courses · Messages · Resources" />
      <TextInput
        className="rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3 text-base text-foreground dark:text-dark-foreground"
        placeholder="Search Eduverse"
        placeholderTextColor={isDarkTheme ? "#a1a1aa" : "#94a3b8"}
      />

      <Section title="Security" />
      <SimpleRow title="Password and account" meta="Reset password, manage sessions, and review account access." trailing="Soon" />

      <Pressable className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-4 dark:border-red-900 dark:bg-red-950" onPress={onSignOut}>
        <Text className="text-center text-base font-bold text-red-600 dark:text-red-300">Sign out</Text>
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
