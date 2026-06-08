import { Text, View } from "react-native";
import { BookOpen, FileText, MessageSquare, Radio } from "lucide-react-native";

import { ActionButton } from "@/components/common/ActionButton";
import { Badge } from "@/components/common/Badge";
import { ProgressBar } from "@/components/cards/ProgressBar";

export type CourseCardModel = {
  canStartSession?: boolean;
  id: string;
  code: string;
  instructor: string;
  liveNow?: boolean;
  materials: number;
  progress: number;
  room: string;
  schedule: string;
  title: string;
  unreadMessages: number;
};

type CourseCardProps = {
  course: CourseCardModel;
  isTablet: boolean;
  onOpenChat?: () => void;
  onOpenMaterials?: () => void;
  onOpenSession?: () => void;
};

export function CourseCard({ course, isTablet, onOpenChat, onOpenMaterials, onOpenSession }: CourseCardProps) {
  const sessionAvailable = course.liveNow || course.canStartSession;

  return (
    <View className="rounded-[28px] border border-border bg-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card" style={{ width: isTablet ? "48.5%" : "100%" }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-brand-500">
            <BookOpen color="#ffffff" size={23} strokeWidth={2.5} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-sky-300">{course.code}</Text>
            <Text className="mt-1 text-xl font-black text-foreground dark:text-dark-foreground" numberOfLines={1}>{course.title}</Text>
            <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">{course.instructor}</Text>
          </View>
        </View>
        {course.liveNow ? <Badge label="Live" /> : null}
      </View>
      <Text className="mt-4 text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground">
        {course.schedule} · {course.room}
      </Text>
      <ProgressBar value={course.progress} />
      <View className="mt-5 flex-row flex-wrap gap-2">
        {sessionAvailable ? (
          <ActionButton
            icon={Radio}
            label={course.liveNow ? "Join live" : "Start live"}
            isPrimary={course.liveNow || course.canStartSession}
            onPress={onOpenSession}
          />
        ) : null}
        <ActionButton icon={MessageSquare} label="Chat" onPress={onOpenChat} />
        <ActionButton icon={FileText} label="Materials" onPress={onOpenMaterials} />
      </View>
      <Text className="mt-4 text-xs font-bold text-muted-foreground dark:text-dark-muted-foreground">
        {course.materials} materials · {course.unreadMessages} unread messages
      </Text>
    </View>
  );
}
