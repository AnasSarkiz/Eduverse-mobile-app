import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import type { ScreenKey, TabItem } from "@/types/navigation";

type BottomTabsProps = {
  activeTab: ScreenKey;
  contentMaxWidth?: number;
  onChangeTab: (tab: ScreenKey) => void;
  tabs: TabItem[];
};

export function BottomTabs({ activeTab, contentMaxWidth, onChangeTab, tabs }: BottomTabsProps) {
  const { colorScheme } = useColorScheme();
  const inactiveIconColor = colorScheme === "dark" ? "#a1a1aa" : "#71717a";

  return (
    <View className="absolute inset-x-0 bottom-0 border-t border-border dark:border-dark-border bg-card dark:bg-dark-card px-3 pb-3 pt-2">
      <View className="mx-auto flex-row" style={{ maxWidth: contentMaxWidth ?? 640 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <Pressable key={tab.key} className="flex-1 items-center rounded-md px-1 py-2" onPress={() => onChangeTab(tab.key)}>
            <View
              className={`h-8 w-8 items-center justify-center rounded-lg ${
                activeTab === tab.key ? "bg-brand-500" : "bg-muted dark:bg-dark-muted"
              }`}
            >
              <Icon color={activeTab === tab.key ? "#ffffff" : inactiveIconColor} size={16} strokeWidth={2.4} />
            </View>
            <Text
              className={`mt-1 text-xs font-semibold ${activeTab === tab.key ? "text-brand-600" : "text-muted-foreground dark:text-dark-muted-foreground"}`}
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
