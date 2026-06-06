import { Text, View } from "react-native";

import { CourseCard } from "@/components/cards/CourseCard";
import { SimpleRow } from "@/components/cards/SimpleRow";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";

export function CoursesScreen({ isTablet }: { isTablet: boolean }) {
  const { assignments, classes, materials, messages, openMaterial, selectClass } = useEduverse();

  return (
    <View>
      <Section title="Courses & Classes" action={`${classes.length} enrolled`} />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        {classes.map((classItem) => (
          <CourseCard
            key={classItem.id}
            course={{
              id: classItem.id,
              code: classItem.code,
              instructor: classItem.teacher?.display_name ?? "No teacher assigned",
              materials: materials.filter((material) => material.classId === classItem.id).length,
              progress: getClassProgress(classItem.id, assignments),
              room: classItem.room ?? "No room",
              schedule: classItem.schedule_text ?? "No schedule",
              title: classItem.name,
              unreadMessages: messages.filter((message) => message.classId === classItem.id).length
            }}
            isTablet={isTablet}
            onOpenChat={() => selectClass(classItem.id)}
          />
        ))}
      </View>
      {classes.length === 0 ? <EmptyText text="No classes are available for your selected organization yet." /> : null}

      <Section title="Resources" action="Downloads" />
      {materials.map((resource) => (
        <SimpleRow
          key={resource.id}
          title={resource.title}
          meta={`${classes.find((classItem) => classItem.id === resource.classId)?.code ?? "Class"} · ${resource.type.toUpperCase()} · ${resource.originalFilename}`}
          trailing="Open"
          onPress={() => openMaterial(resource.id)}
        />
      ))}
      {materials.length === 0 ? <EmptyText text="No class materials have been uploaded yet." /> : null}
    </View>
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
