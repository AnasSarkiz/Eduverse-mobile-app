import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { ChevronLeft, Megaphone, MessageCircle, Send, UsersRound } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { Badge } from "@/components/common/Badge";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";
import type { ChatMessage, NotificationRecord, OrganizationClass } from "@/services/eduverseApi";

export function ChatScreen({ isTablet }: { isTablet: boolean }) {
  const { activeClass, classes, messages, notifications, selectClass, sendMessage, user } = useEduverse();
  const { colorScheme } = useColorScheme();
  const [input, setInput] = useState("");
  const [openClassId, setOpenClassId] = useState<string | null>(null);
  const openClass = classes.find((classItem) => classItem.id === openClassId) ?? null;
  const activeClassMessageCount = activeClass ? messages.filter((message) => message.classId === activeClass.id).length : 0;
  const activeMessages = useMemo(
    () => (openClass ? messages.filter((message) => message.classId === openClass.id) : []),
    [openClass, messages]
  );
  const announcements = useMemo(
    () => notifications.filter((notification) => notification.type === "chat_announcement"),
    [notifications]
  );
  const placeholderColor = colorScheme === "dark" ? "#71717a" : "#94a3b8";

  async function submit() {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  }

  async function openThread(classId: string) {
    setInput("");
    setOpenClassId(classId);
    await selectClass(classId);
  }

  if (openClass) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 gap-3"
        keyboardVerticalOffset={92}
      >
        <View className="flex-row items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-sm dark:border-dark-border dark:bg-dark-card">
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-2xl bg-muted dark:bg-dark-muted"
            onPress={() => {
              setOpenClassId(null);
              setInput("");
            }}
          >
            <ChevronLeft color={colorScheme === "dark" ? "#f4f4f5" : "#18181b"} size={24} strokeWidth={2.6} />
          </Pressable>
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-500">
            <MessageCircle color="#ffffff" size={21} strokeWidth={2.5} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-base font-black text-foreground dark:text-dark-foreground" numberOfLines={1}>
              {openClass.name}
            </Text>
            <Text className="mt-0.5 text-xs font-bold uppercase text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={1}>
              {openClass.code} · {activeMessages.length} messages
            </Text>
          </View>
        </View>

        <ClassConversation
          activeMessages={activeMessages}
          classItem={openClass}
          input={input}
          onChangeInput={setInput}
          onSubmit={submit}
          placeholderColor={placeholderColor}
          userId={user?.id ?? null}
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
      <View>
        <Section title="Chats" action={`${classes.length} classes`} />
        <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
          {classes.map((classItem) => {
            return (
              <ClassThreadCard
                active={activeClass?.id === classItem.id}
                classItem={classItem}
                isTablet={isTablet}
                key={classItem.id}
                messageCount={activeClass?.id === classItem.id ? activeClassMessageCount : 0}
                onPress={() => {
                  void openThread(classItem.id);
                }}
              />
            );
          })}
        </View>
        {classes.length === 0 ? <EmptyState title="No class chats yet" body="Choose an organization with classes to start messaging." /> : null}

        <Section title="Announcements" action={announcements.length ? "Pinned" : "None"} />
        <View className="gap-3">
          {announcements.map((announcement) => (
            <AnnouncementCard announcement={announcement} key={announcement.id} />
          ))}
          {announcements.length === 0 ? <EmptyState title="No pinned announcements" body="Teacher announcements will stay visible here." compact /> : null}
        </View>
      </View>
    </ScrollView>
  );
}

function ClassConversation({
  activeMessages,
  classItem,
  input,
  onChangeInput,
  onSubmit,
  placeholderColor,
  userId
}: {
  activeMessages: ChatMessage[];
  classItem: OrganizationClass;
  input: string;
  onChangeInput: (value: string) => void;
  onSubmit: () => void;
  placeholderColor: string;
  userId: string | null;
}) {
  return (
    <View className="min-h-0 flex-1 gap-3">
      <View className="min-h-0 flex-1 overflow-hidden rounded-3xl bg-muted/50 dark:bg-dark-muted/30">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ gap: 12, paddingBottom: 18, paddingHorizontal: 8, paddingTop: 16 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="rounded-full bg-card px-3 py-1 dark:bg-dark-card">
              <Text className="text-xs font-bold uppercase text-muted-foreground dark:text-dark-muted-foreground">
                {classItem.teacher?.display_name ?? "Class group"} · {classItem.room ?? "No room"}
              </Text>
            </View>
          </View>
          {activeMessages.map((message) => (
            <MessageBubble isMe={message.senderId === userId} key={message.id} message={message} />
          ))}
          {activeMessages.length === 0 ? (
            <EmptyState title="No messages yet" body="Send the first class message and it will appear here." compact />
          ) : null}
        </ScrollView>
      </View>

      <View className="flex-row items-end gap-2 rounded-3xl border border-border bg-card px-3 py-2 shadow-sm dark:border-dark-border dark:bg-dark-card">
        <TextInput
          className="max-h-28 flex-1 py-2 text-base text-foreground dark:text-dark-foreground"
          multiline
          onChangeText={onChangeInput}
          placeholder="Message class"
          placeholderTextColor={placeholderColor}
          value={input}
        />
        <Pressable
          className={`h-11 w-11 items-center justify-center rounded-2xl ${input.trim() ? "bg-brand-500" : "bg-muted dark:bg-dark-muted"}`}
          onPress={onSubmit}
        >
          <Send color={input.trim() ? "#ffffff" : placeholderColor} size={19} strokeWidth={2.6} />
        </Pressable>
      </View>
    </View>
  );
}

function ClassThreadCard({
  active,
  classItem,
  isTablet,
  messageCount,
  onPress
}: {
  active: boolean;
  classItem: OrganizationClass;
  isTablet: boolean;
  messageCount: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`rounded-2xl border p-4 shadow-sm ${
        active ? "border-brand-500 bg-brand-subtle dark:border-sky-400 dark:bg-dark-brand-subtle" : "border-border bg-card dark:border-dark-border dark:bg-dark-card"
      }`}
      onPress={onPress}
      style={{ width: isTablet ? "48.5%" : "100%" }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View className={`h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-brand-500" : "bg-sky-500/15"}`}>
            <UsersRound color={active ? "#ffffff" : "#38bdf8"} size={21} strokeWidth={2.5} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-base font-black text-foreground dark:text-dark-foreground" numberOfLines={1}>
              {classItem.name}
            </Text>
            <Text className="mt-1 text-xs font-bold uppercase text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={1}>
              {classItem.code} · {classItem.teacher?.display_name ?? "No teacher"}
            </Text>
          </View>
        </View>
        {active ? <Badge label="Open" /> : null}
      </View>
      <Text className="mt-4 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={2}>
        {active && messageCount ? `${messageCount} messages in this class conversation.` : "Tap to open this class conversation."}
      </Text>
    </Pressable>
  );
}

function MessageBubble({ isMe, message }: { isMe: boolean; message: ChatMessage }) {
  const senderName = message.senderName && message.senderName !== "Unknown" ? message.senderName : "Classmate";

  return (
    <View className={`max-w-[82%] gap-1 px-1 ${isMe ? "self-end" : "self-start"}`}>
      <Text className={`px-1 text-[11px] font-bold ${isMe ? "text-right text-brand-600" : "text-muted-foreground dark:text-dark-muted-foreground"}`}>
        {isMe ? "You" : senderName} · {formatShortTime(message.createdAt)}
      </Text>
      <View className={`rounded-3xl px-4 py-3 ${isMe ? "rounded-br-lg bg-brand-500" : "rounded-bl-lg bg-card dark:bg-dark-card"}`}>
        <Text className={`text-base leading-6 ${isMe ? "text-white" : "text-foreground dark:text-dark-foreground"}`}>{message.content}</Text>
      </View>
    </View>
  );
}

function AnnouncementCard({ announcement }: { announcement: NotificationRecord }) {
  return (
    <View className="rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/20">
          <Megaphone color="#f59e0b" size={20} strokeWidth={2.5} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-base font-black text-foreground dark:text-dark-foreground">{announcement.title}</Text>
          <Text className="mt-1 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">{announcement.body}</Text>
          <Text className="mt-3 text-xs font-bold uppercase text-muted-foreground dark:text-dark-muted-foreground">
            {formatTime(announcement.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function EmptyState({ body, compact = false, title }: { body: string; compact?: boolean; title: string }) {
  return (
    <View className={`items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-5 dark:border-dark-border dark:bg-dark-muted/30 ${compact ? "py-6" : "py-8"}`}>
      <Text className="text-center text-base font-black text-foreground dark:text-dark-foreground">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">{body}</Text>
    </View>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatShortTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
