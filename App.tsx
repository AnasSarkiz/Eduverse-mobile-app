import "./global.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { SectionTitle } from "@/components/SectionTitle";
import { StatCard } from "@/components/StatCard";
import { TimelineItemCard } from "@/components/TimelineItemCard";
import { dashboardStats, quickActions, timeline } from "@/data/dashboard";

export default function App() {
  const { width } = useWindowDimensions();
  const isCompactPhone = width < 360;
  const isTablet = width >= 768;
  const horizontalPadding = isCompactPhone ? 16 : isTablet ? 32 : 20;
  const contentMaxWidth = isTablet ? 760 : undefined;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignSelf: "center",
          maxWidth: contentMaxWidth,
          paddingBottom: 32,
          paddingHorizontal: horizontalPadding,
          width: "100%"
        }}
      >
        <View className="pt-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-sm font-semibold uppercase text-brand-600">Eduverse</Text>
            <Text className="rounded-md bg-white px-2 py-1 text-xs font-semibold uppercase text-slate-500">
              {Platform.OS === "ios" ? "iPhone ready" : Platform.OS === "android" ? "Android ready" : "Responsive"}
            </Text>
          </View>
          <Text className={`${isCompactPhone ? "text-2xl leading-8" : "text-3xl leading-9"} mt-2 font-bold text-ink`}>
            Today at a glance
          </Text>
          <Text className={`${isCompactPhone ? "text-sm leading-5" : "text-base leading-6"} mt-2 text-slate-600`}>
            Your mobile command center for learning updates, messages, and deadlines.
          </Text>
        </View>

        <View className="mt-6 rounded-lg bg-ink p-5">
          <View className={isTablet ? "flex-row items-center justify-between gap-5" : "gap-4"}>
            <View className="flex-1">
              <Text className="text-sm font-semibold uppercase text-cyan-200">Next class</Text>
              <Text className="mt-2 text-xl font-bold text-white">Data Structures</Text>
              <Text className="mt-1 text-sm text-slate-300">Starts at 14:30 in Room B12</Text>
            </View>
            <Pressable className="self-start rounded-md bg-brand-500 px-4 py-3">
              <Text className="text-sm font-bold text-white">Open class</Text>
            </Pressable>
          </View>
        </View>

        <SectionTitle title="Snapshot" />
        <View className={isTablet ? "flex-row gap-3" : ""}>
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} isFluid={isTablet} />
          ))}
        </View>

        <SectionTitle title="Quick actions" />
        <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
          {quickActions.map((action) => (
            <Pressable
              key={action.title}
              className="rounded-lg border border-slate-200 bg-white p-4"
              style={{ width: isTablet ? "48.5%" : "100%" }}
            >
              <Text className="text-base font-semibold text-ink">{action.title}</Text>
              <Text className="mt-1 text-sm leading-5 text-slate-600">{action.description}</Text>
            </Pressable>
          ))}
        </View>

        <SectionTitle title="Latest updates" action="View all" />
        <View className={isTablet ? "flex-row flex-wrap gap-3" : ""}>
          {timeline.map((item) => (
            <TimelineItemCard key={`${item.title}-${item.time}`} {...item} isFluid={isTablet} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
