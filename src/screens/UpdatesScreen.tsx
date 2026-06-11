import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { ArrowLeft, Bell, CheckCircle2, Megaphone, type LucideIcon } from "lucide-react-native";

import { NotificationRow } from "@/components/cards/NotificationRow";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";
import type { NotificationRecord } from "@/services/eduverseApi";

type UpdatesScreenProps = {
  isTablet: boolean;
  onBack: () => void;
};

export function UpdatesScreen({ isTablet, onBack }: UpdatesScreenProps) {
  const { markRead, notifications } = useEduverse();
  const unreadNotifications = useMemo(() => notifications.filter((notification) => !notification.readAt), [notifications]);
  const announcementNotifications = useMemo(() => notifications.filter(isAnnouncement), [notifications]);
  const otherNotifications = useMemo(() => notifications.filter((notification) => !isAnnouncement(notification)), [notifications]);

  function markAllRead() {
    void Promise.all(unreadNotifications.map((notification) => markRead(notification.id)));
  }

  return (
    <View>
      <View className="mb-5 flex-row items-center gap-3">
        <Pressable accessibilityLabel="Back to Today" accessibilityRole="button" className="h-11 w-11 items-center justify-center rounded-2xl bg-muted dark:bg-dark-muted" onPress={onBack}>
          <ArrowLeft color="#4f46e5" size={23} strokeWidth={2.6} />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-black uppercase text-brand-600 dark:text-sky-300">Inbox</Text>
          <Text className="mt-1 text-3xl font-black text-foreground dark:text-dark-foreground" numberOfLines={1}>
            Updates
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={1}>
            Notifications and class announcements
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Mark all updates as read"
          accessibilityRole="button"
          className={`h-11 w-11 items-center justify-center rounded-2xl bg-card shadow-sm dark:bg-dark-card ${unreadNotifications.length ? "" : "opacity-50"}`}
          disabled={!unreadNotifications.length}
          onPress={markAllRead}
        >
          <CheckCircle2 color="#4f46e5" size={20} strokeWidth={2.5} />
        </Pressable>
      </View>

      <View className="rounded-[32px] bg-brand-500 p-6 dark:bg-brand-700">
        <Text className="text-[11px] font-black uppercase tracking-widest text-blue-100">Unread updates</Text>
        <Text className="mt-3 text-5xl font-black text-white">{unreadNotifications.length}</Text>
        <Text className="mt-2 text-sm font-semibold leading-6 text-blue-100">
          {unreadNotifications.length ? "Tap any item to mark it as read." : "You are caught up."}
        </Text>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-3">
        <UpdateMetric
          icon={Megaphone}
          isTablet={isTablet}
          label="Announcements"
          value={String(announcementNotifications.length)}
        />
        <UpdateMetric icon={Bell} isTablet={isTablet} label="Notifications" value={String(otherNotifications.length)} />
      </View>

      <Section title="Announcements" action={announcementNotifications.length ? `${announcementNotifications.length} total` : "None"} />
      {announcementNotifications.map((item) => (
        <NotificationRow key={item.id} item={toNotificationRowItem(item)} onPress={() => markRead(item.id)} />
      ))}
      {announcementNotifications.length === 0 ? <EmptyText text="No announcements have been posted yet." /> : null}

      <Section title="Notifications" action={otherNotifications.length ? `${otherNotifications.length} total` : "Clear"} />
      {otherNotifications.map((item) => (
        <NotificationRow key={item.id} item={toNotificationRowItem(item)} onPress={() => markRead(item.id)} />
      ))}
      {notifications.length === 0 ? <EmptyText text="New updates from classes, tasks, and messages will appear here." /> : null}
      {notifications.length > 0 && otherNotifications.length === 0 ? <EmptyText text="No other notifications right now." /> : null}
    </View>
  );
}

function UpdateMetric({
  icon: Icon,
  isTablet,
  label,
  value
}: {
  icon: LucideIcon;
  isTablet: boolean;
  label: string;
  value: string;
}) {
  return (
    <View className="rounded-[28px] border border-border bg-card p-4 shadow-sm dark:border-dark-border dark:bg-dark-card" style={{ width: isTablet ? "48.5%" : "100%" }}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-subtle dark:bg-dark-brand-subtle">
          <Icon color="#4f46e5" size={19} strokeWidth={2.5} />
        </View>
        <Text className="text-3xl font-black text-foreground dark:text-dark-foreground">{value}</Text>
      </View>
      <Text className="mt-3 text-[11px] font-black uppercase text-muted-foreground dark:text-dark-muted-foreground">{label}</Text>
    </View>
  );
}

function EmptyText({ text }: { text: string }) {
  return <Text className="text-sm text-muted-foreground dark:text-dark-muted-foreground">{text}</Text>;
}

function isAnnouncement(notification: NotificationRecord) {
  return notification.type.includes("announcement");
}

function toNotificationRowItem(item: NotificationRecord) {
  const category = item.type.includes("assignment")
    ? ("deadline" as const)
    : item.type.includes("message")
      ? ("message" as const)
      : isAnnouncement(item)
        ? ("announcement" as const)
        : ("course" as const);

  return {
    id: item.id,
    body: item.body,
    category,
    time: formatDate(item.createdAt),
    title: item.title,
    unread: !item.readAt
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
