import { Text, View } from "react-native";

import { SimpleRow } from "@/components/cards/SimpleRow";
import { Badge } from "@/components/common/Badge";
import { Section } from "@/components/common/Section";
import { announcements, chatThreads } from "@/data/mobileMvp";

export function ChatScreen({ isTablet }: { isTablet: boolean }) {
  return (
    <View>
      <Section title="Chats" action="Student · Group · Support" />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        {chatThreads.map((thread) => (
          <View
            key={thread.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
            style={{ width: isTablet ? "48.5%" : "100%" }}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-bold text-ink">{thread.title}</Text>
                <Text className="mt-1 text-xs font-semibold uppercase text-slate-400">{thread.subtitle}</Text>
              </View>
              {thread.unread > 0 ? <Badge label={String(thread.unread)} /> : null}
            </View>
            <Text className="mt-3 text-sm leading-5 text-slate-600">{thread.lastMessage}</Text>
            <Text className="mt-3 text-xs font-semibold text-slate-400">{thread.time}</Text>
          </View>
        ))}
      </View>

      <Section title="Announcements" action="Pinned" />
      {announcements.map((announcement) => (
        <SimpleRow key={announcement.id} title={announcement.title} meta={`${announcement.scope} · ${announcement.body}`} trailing={announcement.time} />
      ))}
    </View>
  );
}
