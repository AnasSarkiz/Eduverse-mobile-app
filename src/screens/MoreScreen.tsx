import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { SimpleRow } from "@/components/cards/SimpleRow";
import { Section } from "@/components/common/Section";
import { SettingRow } from "@/components/common/SettingRow";
import { profile, roleOptions, type UserRole } from "@/data/mobileMvp";

type MoreScreenProps = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  onSignOut: () => void;
  isTablet: boolean;
};

export function MoreScreen({ role, setRole, onSignOut, isTablet }: MoreScreenProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <View>
      <Section title="Profile" action="Account" />
      <View className="rounded-xl bg-card p-4 shadow-sm">
        <Text className="text-xl font-bold text-foreground">{profile.name}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">{profile.email}</Text>
        <Text className="mt-3 text-xs font-bold uppercase text-brand-600">
          {profile.organization} · {role}
        </Text>
      </View>

      <Section title="Settings" action="Preferences" />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        <SettingRow label="Push notifications" value={pushEnabled} onChange={setPushEnabled} isTablet={isTablet} />
        <SettingRow label="Offline basics" value={offlineEnabled} onChange={setOfflineEnabled} isTablet={isTablet} />
        <SettingRow label="Dark theme" value={darkTheme} onChange={setDarkTheme} isTablet={isTablet} />
      </View>

      <Section title="Role access" />
      <View className="flex-row gap-2">
        {roleOptions.map((option) => (
          <Pressable
            key={option}
            className={`flex-1 rounded-md px-3 py-3 ${role === option ? "bg-brand-500" : "bg-card"}`}
            onPress={() => setRole(option)}
          >
            <Text className={`text-center text-xs font-bold uppercase ${role === option ? "text-white" : "text-muted-foreground"}`}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      <Section title="Search" action="Courses · Messages · Resources" />
      <TextInput
        className="rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
        placeholder="Search Eduverse"
        placeholderTextColor="#94a3b8"
      />

      <Section title="Security" />
      <SimpleRow title="Password and account" meta="Reset password, manage sessions, and review account access." trailing="Soon" />

      <Pressable className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-4" onPress={onSignOut}>
        <Text className="text-center text-base font-bold text-red-600">Sign out</Text>
      </Pressable>
    </View>
  );
}
