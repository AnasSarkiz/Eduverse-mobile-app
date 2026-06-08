import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AssignmentCard } from "@/components/cards/AssignmentCard";
import { SimpleRow } from "@/components/cards/SimpleRow";
import { Section } from "@/components/common/Section";
import { useEduverse } from "@/providers/EduverseProvider";

export function TasksScreen({ isTablet }: { isTablet: boolean }) {
  const { assignments, classes, submitAssignment } = useEduverse();
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const activeAssignment = assignments.find((assignment) => assignment.id === activeAssignmentId) ?? assignments[0] ?? null;

  async function submit() {
    if (!activeAssignment || !response.trim()) return;
    await submitAssignment(activeAssignment.id, response);
    setResponse("");
    setActiveAssignmentId(null);
  }

  return (
    <View>
      <Section title="Assignments & Deadlines" action={assignments.length ? `${assignments.length} total` : "Empty"} />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-4"}>
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={{
              id: assignment.id,
              courseCode: classes.find((classItem) => classItem.id === assignment.classId)?.code ?? "Class",
              dueLabel: formatDueLabel(assignment.dueAt),
              score: assignment.mySubmission?.score === null || assignment.mySubmission?.score === undefined ? undefined : `${assignment.mySubmission.score}/${assignment.maxScore}`,
              status: getAssignmentStatus(assignment),
              title: assignment.title
            }}
            isTablet={isTablet}
            onPress={() => setActiveAssignmentId(assignment.id)}
          />
        ))}
      </View>
      {assignments.length === 0 ? <Text className="text-sm text-muted-foreground dark:text-dark-muted-foreground">No assignments yet.</Text> : null}

      {activeAssignment ? (
        <>
          <Section title="Submit response" action={activeAssignment.title} />
          <TextInput
            className="min-h-32 rounded-[28px] border border-border bg-card px-5 py-4 text-base text-foreground shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-dark-foreground"
            multiline
            onChangeText={setResponse}
            placeholder="Write your assignment response"
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
            value={response}
          />
          <Pressable
            className={`mt-4 rounded-2xl bg-brand-500 px-4 py-4 ${response.trim() ? "" : "opacity-50"}`}
            disabled={!response.trim()}
            onPress={submit}
          >
            <Text className="text-center text-sm font-black text-white">Submit assignment</Text>
          </Pressable>
        </>
      ) : null}

      <Section title="Due dates" />
      {assignments.slice(0, 8).map((item) => (
        <SimpleRow
          key={item.id}
          title={item.title}
          meta={classes.find((classItem) => classItem.id === item.classId)?.name ?? "Class assignment"}
          trailing={formatDueLabel(item.dueAt)}
        />
      ))}
    </View>
  );
}

function getAssignmentStatus(assignment: { dueAt: string; mySubmission: { gradedAt: string | null } | null }) {
  if (assignment.mySubmission?.gradedAt) return "graded";
  if (assignment.mySubmission) return "submitted";
  if (Date.parse(assignment.dueAt) < Date.now()) return "overdue";
  return "pending";
}

function formatDueLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
