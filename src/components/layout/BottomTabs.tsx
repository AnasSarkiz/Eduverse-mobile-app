import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import type { ScreenKey, TabItem, TabKey } from "@/types/navigation";

type BottomTabsProps = {
  activeTab: ScreenKey;
  contentMaxWidth?: number;
  onChangeTab: (tab: TabKey) => void;
  tabs: TabItem[];
};

export function BottomTabs({ activeTab, contentMaxWidth, onChangeTab, tabs }: BottomTabsProps) {
  const { colorScheme } = useColorScheme();
  const inactiveIconColor = colorScheme === "dark" ? "#a8b3c7" : "#64748b";

  return (
    <View className="absolute inset-x-0 bottom-0 px-4 pb-3">
      <View
        className="mx-auto flex-row rounded-[26px] border border-border bg-card px-2 py-1.5 shadow-sm dark:border-dark-border dark:bg-dark-card"
        style={{ maxWidth: contentMaxWidth ?? 640 }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <Pressable key={tab.key} className="flex-1 items-center rounded-3xl px-1 py-1" onPress={() => onChangeTab(tab.key)}>
              <View className={`h-10 min-w-10 items-center justify-center rounded-2xl px-3 ${isActive ? "bg-brand-500" : "bg-transparent"}`}>
                <Icon color={isActive ? "#ffffff" : inactiveIconColor} size={19} strokeWidth={2.5} />
              </View>
              <Text
                className={`mt-0.5 text-[11px] font-black ${isActive ? "text-brand-600 dark:text-sky-300" : "text-muted-foreground dark:text-dark-muted-foreground"}`}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
