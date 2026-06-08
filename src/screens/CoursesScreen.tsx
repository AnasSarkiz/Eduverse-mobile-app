import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { ChevronLeft, Download, FileImage, FileText, Presentation, Search, Video, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { CourseCard } from "@/components/cards/CourseCard";
import { SimpleRow } from "@/components/cards/SimpleRow";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";
import type { ClassMaterial, OrganizationClass } from "@/services/eduverseApi";

type MaterialClassRequest = { classId: string; id: number } | null;

export function CoursesScreen({ isTablet, materialClassRequest }: { isTablet: boolean; materialClassRequest?: MaterialClassRequest }) {
  const {
    assignments,
    classes,
    downloadingMaterialId,
    errorMessage,
    joinLiveSession,
    liveSessions,
    materials,
    messages,
    openMaterial,
    selectClass,
    user
  } = useEduverse();
  const [openMaterialsClassId, setOpenMaterialsClassId] = useState<string | null>(null);
  const canStartSession = user?.role === "admin" || user?.role === "teacher";
  const openMaterialsClass = classes.find((classItem) => classItem.id === openMaterialsClassId) ?? null;
  const openClassMaterials = useMemo(
    () => (openMaterialsClass ? materials.filter((material) => material.classId === openMaterialsClass.id) : []),
    [materials, openMaterialsClass]
  );

  useEffect(() => {
    if (materialClassRequest?.classId) {
      setOpenMaterialsClassId(materialClassRequest.classId);
    }
  }, [materialClassRequest]);

  if (openMaterialsClass) {
    return (
      <ClassMaterialsScreen
        classItem={openMaterialsClass}
        materials={openClassMaterials}
        downloadingMaterialId={downloadingMaterialId}
        errorMessage={errorMessage}
        onBack={() => setOpenMaterialsClassId(null)}
        onOpenMaterial={openMaterial}
      />
    );
  }

  return (
    <View>
      <Section title="Courses & Classes" action={`${classes.length} enrolled`} />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-4"}>
        {classes.map((classItem) => (
          <CourseCard
            key={classItem.id}
            course={{
              canStartSession,
              id: classItem.id,
              code: classItem.code,
              instructor: classItem.teacher?.display_name ?? "No teacher assigned",
              liveNow: liveSessions.some((session) => session.class_id === classItem.id),
              materials: materials.filter((material) => material.classId === classItem.id).length,
              progress: getClassProgress(classItem.id, assignments),
              room: classItem.room ?? "No room",
              schedule: classItem.schedule_text ?? "No schedule",
              title: classItem.name,
              unreadMessages: messages.filter((message) => message.classId === classItem.id).length
            }}
            isTablet={isTablet}
            onOpenChat={() => selectClass(classItem.id)}
            onOpenMaterials={() => setOpenMaterialsClassId(classItem.id)}
            onOpenSession={() => joinLiveSession(classItem.id)}
          />
        ))}
      </View>
      {classes.length === 0 ? <EmptyText text="No classes are available for your selected organization yet." /> : null}

      <Section title="Live sessions" action={liveSessions.length ? `${liveSessions.length} active` : "None live"} />
      {liveSessions.map((session) => {
        const classItem = classes.find((item) => item.id === session.class_id);

        return (
          <SimpleRow
            key={session.id}
            title={classItem?.name ?? "Class session"}
            meta={`${classItem?.code ?? "Class"} · Live now · ${formatTime(session.last_seen_at)}`}
            trailing="Join"
            onPress={() => joinLiveSession(session.class_id)}
          />
        );
      })}
      {liveSessions.length === 0 ? <EmptyText text={canStartSession ? "No class is live. Start one from a class card." : "No class is live yet."} /> : null}

      <Section title="Materials" action={materials.length ? `${materials.length} files` : "No files"} />
      {isMaterialError(errorMessage) ? <InlineError text={errorMessage} /> : null}
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        {materials.map((resource) => (
          <MaterialCard
            classCode={classes.find((classItem) => classItem.id === resource.classId)?.code ?? "Class"}
            isTablet={isTablet}
            isDownloading={downloadingMaterialId === resource.id}
            key={resource.id}
            material={resource}
            onOpen={() => openMaterial(resource.id)}
          />
        ))}
      </View>
      {materials.length === 0 ? <EmptyText text="No class materials have been uploaded yet." /> : null}
    </View>
  );
}

function ClassMaterialsScreen({
  classItem,
  downloadingMaterialId,
  errorMessage,
  materials,
  onBack,
  onOpenMaterial
}: {
  classItem: OrganizationClass;
  downloadingMaterialId: string | null;
  errorMessage: string | null;
  materials: ClassMaterial[];
  onBack: () => void;
  onOpenMaterial: (materialId: string) => void;
}) {
  const { colorScheme } = useColorScheme();
  const [query, setQuery] = useState("");
  const placeholderColor = colorScheme === "dark" ? "#71717a" : "#94a3b8";
  const filteredMaterials = useMemo(() => filterMaterials(materials, query), [materials, query]);

  return (
    <View>
      <View className="mb-5 flex-row items-center gap-3">
        <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-muted dark:bg-dark-muted" onPress={onBack}>
          <ChevronLeft color="#4f46e5" size={24} strokeWidth={2.6} />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-black uppercase text-brand-600">{classItem.code}</Text>
          <Text className="mt-1 text-2xl font-black text-foreground dark:text-dark-foreground" numberOfLines={1}>
            Materials
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={1}>
            {classItem.name}
          </Text>
        </View>
      </View>

      <View className="rounded-[32px] border border-border bg-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
        <Text className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-sky-300">Class library</Text>
        <Text className="mt-3 text-4xl font-black text-foreground dark:text-dark-foreground">{materials.length}</Text>
        <Text className="mt-1 text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground">
          {materials.length === 1 ? "material available" : "materials available"}
        </Text>
      </View>

      <View className="mt-5 flex-row items-center gap-2 rounded-3xl border border-border bg-card px-4 py-2 shadow-sm dark:border-dark-border dark:bg-dark-card">
        <Search color={placeholderColor} size={18} strokeWidth={2.4} />
        <TextInput
          className="flex-1 py-2 text-base text-foreground dark:text-dark-foreground"
          onChangeText={setQuery}
          placeholder="Search materials"
          placeholderTextColor={placeholderColor}
          value={query}
        />
        {query.trim() ? (
          <Pressable className="h-8 w-8 items-center justify-center rounded-xl bg-muted dark:bg-dark-muted" onPress={() => setQuery("")}>
            <X color={placeholderColor} size={16} strokeWidth={2.5} />
          </Pressable>
        ) : null}
      </View>

      <Section title="Files" action={query.trim() ? `${filteredMaterials.length} found` : materials.length ? "Tap to open" : "Empty"} />
      {isMaterialError(errorMessage) ? <InlineError text={errorMessage} /> : null}
      <View className="gap-4">
        {filteredMaterials.map((material) => (
          <MaterialCard
            classCode={classItem.code}
            isDownloading={downloadingMaterialId === material.id}
            key={material.id}
            material={material}
            onOpen={() => onOpenMaterial(material.id)}
          />
        ))}
        {materials.length === 0 ? <EmptyText text="No materials have been uploaded for this class yet." /> : null}
        {materials.length > 0 && filteredMaterials.length === 0 ? <EmptyText text="No materials match your search." /> : null}
      </View>
    </View>
  );
}

function MaterialCard({
  classCode,
  isDownloading = false,
  isTablet = false,
  material,
  onOpen
}: {
  classCode: string;
  isDownloading?: boolean;
  isTablet?: boolean;
  material: ClassMaterial;
  onOpen: () => void;
}) {
  const Icon = materialIcon(material.type);
  const tone = materialTone(material.type);

  return (
    <Pressable
      className={`rounded-[28px] border border-border bg-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card ${isDownloading ? "opacity-75" : ""}`}
      disabled={isDownloading}
      onPress={onOpen}
      style={{ width: isTablet ? "48.5%" : "100%" }}
    >
      <View className="flex-row items-start gap-3">
        <View className={`h-14 w-14 items-center justify-center rounded-3xl ${tone.background}`}>
          <Icon color={tone.color} size={24} strokeWidth={2.5} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-lg font-black text-foreground dark:text-dark-foreground" numberOfLines={2}>
            {material.title}
          </Text>
          <Text className="mt-1 text-[11px] font-black uppercase text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={1}>
            {classCode} · {material.type} · {formatBytes(material.sizeBytes)}
          </Text>
          {material.description ? (
            <Text className="mt-2 text-sm leading-5 text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={2}>
              {material.description}
            </Text>
          ) : null}
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-muted dark:bg-dark-muted">
          {isDownloading ? <ActivityIndicator color="#4f46e5" size="small" /> : <Download color="#4f46e5" size={17} strokeWidth={2.5} />}
        </View>
      </View>
      <Text className="mt-4 text-xs font-bold text-muted-foreground dark:text-dark-muted-foreground" numberOfLines={1}>
        {isDownloading ? "Downloading..." : `${material.originalFilename} · ${formatDate(material.createdAt)}`}
      </Text>
    </Pressable>
  );
}

function getClassProgress(classId: string, assignments: { classId: string; mySubmission: unknown }[]) {
  const classAssignments = assignments.filter((assignment) => assignment.classId === classId);
  if (classAssignments.length === 0) return 0;
  return Math.round((classAssignments.filter((assignment) => assignment.mySubmission).length / classAssignments.length) * 100);
}

function EmptyText({ text }: { text: string }) {
  return <Text className="text-sm text-muted-foreground dark:text-dark-muted-foreground">{text}</Text>;
}

function InlineError({ text }: { text: string }) {
  return (
    <View className="mb-3 rounded-2xl bg-rose-50 px-4 py-3 dark:bg-rose-500/15">
      <Text className="text-sm font-bold text-rose-700 dark:text-rose-200">{text}</Text>
    </View>
  );
}

function isMaterialError(message: string | null): message is string {
  return Boolean(message && /download|material|file|save|share/i.test(message));
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatBytes(value?: number) {
  if (!value || value <= 0) return "size unknown";
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function materialIcon(type: ClassMaterial["type"]) {
  if (type === "image") return FileImage;
  if (type === "video") return Video;
  if (type === "slide") return Presentation;
  return FileText;
}

function materialTone(type: ClassMaterial["type"]) {
  if (type === "image") return { background: "bg-emerald-50 dark:bg-emerald-500/15", color: "#059669" };
  if (type === "video") return { background: "bg-rose-50 dark:bg-rose-500/15", color: "#e11d48" };
  if (type === "slide") return { background: "bg-amber-50 dark:bg-amber-500/15", color: "#d97706" };
  return { background: "bg-indigo-50 dark:bg-indigo-500/15", color: "#4f46e5" };
}

function filterMaterials(materials: ClassMaterial[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return materials;

  return materials.filter((material) =>
    [
      material.title,
      material.description,
      material.originalFilename,
      material.type,
      material.mimeType
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery))
  );
}
