import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { SimpleRow } from "@/components/cards/SimpleRow";
import { Badge } from "@/components/common/Badge";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";

export function ChatScreen({ isTablet }: { isTablet: boolean }) {
  const { activeClass, classes, messages, notifications, selectClass, sendMessage } = useEduverse();
  const [input, setInput] = useState("");

  async function submit() {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  }

  return (
    <View>
      <Section title="Chats" action="Student · Group · Support" />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        {classes.map((classItem) => {
          const classMessages = messages.filter((message) => message.classId === classItem.id);
          const lastMessage = classMessages[classMessages.length - 1];

          return (
          <Pressable
            key={classItem.id}
            className="rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 shadow-sm"
            onPress={() => selectClass(classItem.id)}
            style={{ width: isTablet ? "48.5%" : "100%" }}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground dark:text-dark-foreground">{classItem.name}</Text>
                <Text className="mt-1 text-xs font-semibold uppercase text-muted-foreground dark:text-dark-muted-foreground">{classItem.code}</Text>
              </View>
              {activeClass?.id === classItem.id ? <Badge label="Open" /> : null}
            </View>
            <Text className="mt-3 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground">
              {lastMessage?.content ?? "No messages yet."}
            </Text>
            <Text className="mt-3 text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground">
              {lastMessage ? formatTime(lastMessage.createdAt) : "Start chat"}
            </Text>
          </Pressable>
          );
        })}
      </View>

      <Section title={activeClass ? `${activeClass.code} messages` : "Messages"} action="Live class chat" />
      {messages.map((message) => (
        <SimpleRow key={message.id} title={message.senderName} meta={message.content} trailing={formatTime(message.createdAt)} />
      ))}
      {activeClass ? (
        <View className="mt-3 flex-row gap-2">
          <TextInput
            className="flex-1 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3 text-base text-foreground dark:text-dark-foreground"
            onChangeText={setInput}
            placeholder="Message class"
            placeholderTextColor="#94a3b8"
            value={input}
          />
          <Pressable className="justify-center rounded-md bg-brand-500 px-4" onPress={submit}>
            <Text className="text-sm font-bold text-white">Send</Text>
          </Pressable>
        </View>
      ) : null}

      <Section title="Announcements" action="Pinned" />
      {notifications.filter((notification) => notification.type === "chat_announcement").map((announcement) => (
        <SimpleRow key={announcement.id} title={announcement.title} meta={announcement.body} trailing={formatTime(announcement.createdAt)} />
      ))}
    </View>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
