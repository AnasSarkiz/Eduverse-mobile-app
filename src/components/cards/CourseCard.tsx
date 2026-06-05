import { Text, View } from "react-native";

import { ActionButton } from "@/components/common/ActionButton";
import { Badge } from "@/components/common/Badge";
import { ProgressBar } from "@/components/cards/ProgressBar";
import type { Course } from "@/data/mobileMvp";

type CourseCardProps = {
  course: Course;
  isTablet: boolean;
};

export function CourseCard({ course, isTablet }: CourseCardProps) {
  return (
    <View className="rounded-lg border border-slate-200 bg-white p-4" style={{ width: isTablet ? "48.5%" : "100%" }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-bold uppercase text-brand-600">{course.code}</Text>
          <Text className="mt-1 text-lg font-bold text-ink">{course.title}</Text>
          <Text className="mt-1 text-sm text-slate-500">{course.instructor}</Text>
        </View>
        {course.liveNow ? <Badge label="Live" /> : null}
      </View>
      <Text className="mt-3 text-sm text-slate-600">
        {course.schedule} · {course.room}
      </Text>
      <ProgressBar value={course.progress} />
      <View className="mt-4 flex-row gap-2">
        <ActionButton label="Home" />
        <ActionButton label="Chat" />
        <ActionButton label="Materials" />
      </View>
      <Text className="mt-3 text-xs font-semibold text-slate-400">
        {course.materials} materials · {course.unreadMessages} unread messages
      </Text>
    </View>
  );
}
