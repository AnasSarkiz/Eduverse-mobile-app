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
    <View className="rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 shadow-sm" style={{ width: isTablet ? "48.5%" : "100%" }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row gap-3">
          <View className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500">
            <BookOpen color="#ffffff" size={18} strokeWidth={2.4} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold uppercase text-brand-600">{course.code}</Text>
            <Text className="mt-1 text-base font-bold text-foreground dark:text-dark-foreground">{course.title}</Text>
            <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground">{course.instructor}</Text>
          </View>
        </View>
        {course.liveNow ? <Badge label="Live" /> : null}
      </View>
      <Text className="mt-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
        {course.schedule} · {course.room}
      </Text>
      <ProgressBar value={course.progress} />
      <View className="mt-4 flex-row gap-2">
        <ActionButton icon={Radio} label={course.liveNow ? "Join live" : course.canStartSession ? "Start live" : "Session"} isPrimary={course.liveNow} onPress={sessionAvailable ? onOpenSession : undefined} />
        <ActionButton icon={MessageSquare} label="Chat" onPress={onOpenChat} />
        <ActionButton icon={FileText} label="Materials" onPress={onOpenMaterials} />
      </View>
      <Text className="mt-3 text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
        {course.materials} materials · {course.unreadMessages} unread messages
      </Text>
    </View>
  );
}
