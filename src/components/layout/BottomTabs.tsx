import { Pressable, Text, View } from "react-native";

import type { ScreenKey, TabItem } from "@/types/navigation";

type BottomTabsProps = {
  activeTab: ScreenKey;
  contentMaxWidth?: number;
  onChangeTab: (tab: ScreenKey) => void;
  tabs: TabItem[];
};

export function BottomTabs({ activeTab, contentMaxWidth, onChangeTab, tabs }: BottomTabsProps) {
  return (
    <View className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white px-3 pb-3 pt-2">
      <View className="mx-auto flex-row" style={{ maxWidth: contentMaxWidth ?? 640 }}>
        {tabs.map((tab) => (
          <Pressable key={tab.key} className="flex-1 items-center rounded-md px-1 py-2" onPress={() => onChangeTab(tab.key)}>
            <View
              className={`h-7 w-7 items-center justify-center rounded-md ${
                activeTab === tab.key ? "bg-brand-500" : "bg-slate-100"
              }`}
            >
              <Text className={`text-xs font-black ${activeTab === tab.key ? "text-white" : "text-slate-500"}`}>
                {tab.icon}
              </Text>
            </View>
            <Text
              className={`mt-1 text-xs font-semibold ${activeTab === tab.key ? "text-brand-600" : "text-slate-500"}`}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
