import { View } from "react-native";

import { AssignmentCard } from "@/components/cards/AssignmentCard";
import { SimpleRow } from "@/components/cards/SimpleRow";
import { Section } from "@/components/common/Section";
import { assignments, calendarItems } from "@/data/mobileMvp";

export function TasksScreen({ isTablet }: { isTablet: boolean }) {
  return (
    <View>
      <Section title="Assignments & Deadlines" action="Submit later" />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} isTablet={isTablet} />
        ))}
      </View>

      <Section title="Calendar" />
      {calendarItems.map((item) => (
        <SimpleRow key={item.id} title={item.title} meta={item.meta} trailing={item.time} />
      ))}
    </View>
  );
}
