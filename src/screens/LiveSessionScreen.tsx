import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItem
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mic, MicOff, PhoneOff, Radio, Users, Video, VideoOff } from "lucide-react-native";
import type { TrackReferenceOrPlaceholder } from "@livekit/react-native";

import { useEduverse, type ActiveLiveSession } from "@/providers/EduverseProvider";
import { liveKitNativeError, loadLiveKitNative } from "@/services/livekitNative";

type LiveKitBundle = NonNullable<ReturnType<typeof loadLiveKitNative>>;

export function LiveSessionScreen() {
  const { activeLiveSession, errorMessage, leaveLiveSession, markLiveSessionConnected } = useEduverse();
  const liveKit = useMemo(() => loadLiveKitNative(), []);

  if (!activeLiveSession) return null;

  if (!liveKit) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 justify-center gap-5 px-6">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15">
            <Radio color="#38bdf8" size={30} />
          </View>
          <View className="gap-3">
            <Text className="text-3xl font-black text-white">Native LiveKit needs a dev build.</Text>
            <Text className="text-base leading-7 text-slate-300">
              Expo Go cannot load the native WebRTC module. Build the Eduverse development client, then open this session again.
            </Text>
            {liveKitNativeError() ? <Text className="text-sm text-rose-300">{liveKitNativeError()?.message}</Text> : null}
          </View>
          <Pressable
            className="h-14 items-center justify-center rounded-2xl bg-sky-500"
            onPress={() => {
              void leaveLiveSession({ endSession: false });
            }}
          >
            <Text className="text-base font-black text-white">Back to Eduverse</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <liveKit.native.LiveKitRoom
        audio={true}
        connect={true}
        connectOptions={{ autoSubscribe: true }}
        onConnected={() => {
          void markLiveSessionConnected();
        }}
        onDisconnected={() => {
          void leaveLiveSession({ endSession: false });
        }}
        onError={(error) => {
          console.warn("LiveKit room error", error);
        }}
        options={{ adaptiveStream: { pixelDensity: "screen" }, dynacast: true }}
        serverUrl={activeLiveSession.token.serverUrl}
        token={activeLiveSession.token.participantToken}
        video={false}
      >
        <NativeLiveSessionRoom
          activeLiveSession={activeLiveSession}
          errorMessage={errorMessage}
          liveKit={liveKit}
          onLeave={() => {
            void leaveLiveSession({ endSession: activeLiveSession.isHost });
          }}
        />
      </liveKit.native.LiveKitRoom>
    </SafeAreaView>
  );
}

function NativeLiveSessionRoom({
  activeLiveSession,
  errorMessage,
  liveKit,
  onLeave
}: {
  activeLiveSession: ActiveLiveSession;
  errorMessage: string | null;
  liveKit: LiveKitBundle;
  onLeave: () => void;
}) {
  const { width } = useWindowDimensions();
  const tracks = liveKit.native.useTracks([{ source: liveKit.client.Track.Source.Camera, withPlaceholder: true }], {
    onlySubscribed: false
  }) as TrackReferenceOrPlaceholder[];
  const participants = liveKit.native.useParticipants();
  const connectionState = liveKit.native.useConnectionState();
  const columns = width >= 720 ? 3 : width >= 430 ? 2 : 1;

  useEffect(() => {
    void liveKit.native.AudioSession.startAudioSession();
    return () => {
      void liveKit.native.AudioSession.stopAudioSession();
    };
  }, [liveKit]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => (
    <ParticipantTile columns={columns} item={item} liveKit={liveKit} />
  );

  return (
    <View className="flex-1">
      <View className="gap-4 px-4 pb-3 pt-2">
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-xs font-black uppercase tracking-[3px] text-sky-300">
              {activeLiveSession.isHost ? "Hosting live" : "Live session"}
            </Text>
            <Text className="mt-1 text-2xl font-black text-white" numberOfLines={1}>
              {activeLiveSession.className}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
            <Users color="#bae6fd" size={16} />
            <Text className="text-sm font-black text-white">{participants.length}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <Text className="text-sm font-semibold text-slate-300">{String(connectionState)}</Text>
        </View>
        {errorMessage ? (
          <View className="rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-3">
            <Text className="text-sm font-bold text-rose-100">{errorMessage}</Text>
          </View>
        ) : null}
      </View>

      <FlatList
        className="flex-1 px-4"
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        data={tracks}
        key={columns}
        keyExtractor={(item, index) => trackKey(item, index, liveKit)}
        numColumns={columns}
        renderItem={renderTrack}
        ListEmptyComponent={
          <View className="min-h-80 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] px-6">
            <ActivityIndicator color="#38bdf8" />
            <Text className="mt-4 text-center text-base font-bold text-white">Waiting for participants</Text>
            <Text className="mt-2 text-center text-sm leading-6 text-slate-400">
              Audio is live. Camera tiles appear when someone turns video on.
            </Text>
          </View>
        }
      />

      <RoomControls isHost={activeLiveSession.isHost} liveKit={liveKit} onLeave={onLeave} />
    </View>
  );
}

function ParticipantTile({
  columns,
  item,
  liveKit
}: {
  columns: number;
  item: TrackReferenceOrPlaceholder;
  liveKit: LiveKitBundle;
}) {
  const isTrack = liveKit.native.isTrackReference(item);
  const participantName = participantLabel(item);
  const tileBasis = `${100 / columns}%` as const;

  return (
    <View style={{ flexBasis: tileBasis, maxWidth: tileBasis, paddingHorizontal: columns > 1 ? 6 : 0 }}>
      <View className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[#111827]">
        {isTrack ? (
          <liveKit.native.VideoTrack objectFit="cover" style={{ height: "100%", width: "100%" }} trackRef={item} />
        ) : (
          <View className="h-full w-full items-center justify-center gap-3 bg-slate-900">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-sky-500/20">
              <Text className="text-2xl font-black text-sky-200">{initials(participantName)}</Text>
            </View>
            <Text className="text-base font-black text-white" numberOfLines={1}>
              {participantName}
            </Text>
          </View>
        )}
        <View className="absolute bottom-3 left-3 max-w-[80%] rounded-full bg-black/55 px-3 py-1.5">
          <Text className="text-xs font-black text-white" numberOfLines={1}>
            {participantName}
          </Text>
        </View>
      </View>
    </View>
  );
}

function RoomControls({ isHost, liveKit, onLeave }: { isHost: boolean; liveKit: LiveKitBundle; onLeave: () => void }) {
  const { isCameraEnabled, isMicrophoneEnabled, localParticipant } = liveKit.native.useLocalParticipant();
  const [isTogglingCamera, setIsTogglingCamera] = useState(false);
  const [isTogglingMic, setIsTogglingMic] = useState(false);

  async function toggleMic() {
    setIsTogglingMic(true);
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } finally {
      setIsTogglingMic(false);
    }
  }

  async function toggleCamera() {
    setIsTogglingCamera(true);
    try {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    } finally {
      setIsTogglingCamera(false);
    }
  }

  return (
    <View className="border-t border-white/10 bg-[#020617] px-5 pb-5 pt-4">
      <View className="flex-row justify-center gap-4">
        <ControlButton
          Icon={isMicrophoneEnabled ? Mic : MicOff}
          active={isMicrophoneEnabled}
          disabled={isTogglingMic}
          label={isMicrophoneEnabled ? "Mute" : "Unmute"}
          onPress={() => {
            void toggleMic();
          }}
        />
        <ControlButton
          Icon={isCameraEnabled ? Video : VideoOff}
          active={isCameraEnabled}
          disabled={isTogglingCamera}
          label={isCameraEnabled ? "Camera" : "Camera off"}
          onPress={() => {
            void toggleCamera();
          }}
        />
        <ControlButton Icon={PhoneOff} destructive label={isHost ? "End" : "Leave"} onPress={onLeave} />
      </View>
    </View>
  );
}

function ControlButton({
  Icon,
  active = false,
  destructive = false,
  disabled = false,
  label,
  onPress
}: {
  Icon: ComponentType<{ color?: string; size?: number }>;
  active?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  const background = destructive ? "bg-rose-500" : active ? "bg-sky-500" : "bg-white/10";
  const iconColor = destructive || active ? "#ffffff" : "#cbd5e1";

  return (
    <Pressable
      className={`min-h-16 min-w-24 flex-1 items-center justify-center gap-2 rounded-2xl ${background} ${disabled ? "opacity-50" : ""}`}
      disabled={disabled}
      onPress={onPress}
    >
      <Icon color={iconColor} size={22} />
      <Text className="text-xs font-black text-white">{label}</Text>
    </Pressable>
  );
}

function trackKey(item: TrackReferenceOrPlaceholder, index: number, liveKit: LiveKitBundle) {
  if (liveKit.native.isTrackReference(item)) {
    return item.publication.trackSid || `${item.participant.identity}:${item.source}`;
  }

  return `${item.participant.identity}:${item.source}:${index}`;
}

function participantLabel(item: TrackReferenceOrPlaceholder) {
  return item.participant.name || item.participant.identity || "Participant";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "EV";
}
