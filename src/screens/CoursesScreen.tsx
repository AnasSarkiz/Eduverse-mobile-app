import { View } from "react-native";

import { CourseCard } from "@/components/cards/CourseCard";
import { SimpleRow } from "@/components/cards/SimpleRow";
import { Section } from "@/components/common/Section";
import { courses, resources } from "@/data/mobileMvp";

export function CoursesScreen({ isTablet }: { isTablet: boolean }) {
  return (
    <View>
      <Section title="Courses & Classes" action={`${courses.length} enrolled`} />
      <View className={isTablet ? "flex-row flex-wrap gap-3" : "gap-3"}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} isTablet={isTablet} />
        ))}
      </View>

      <Section title="Resources" action="Downloads" />
      {resources.map((resource) => (
        <SimpleRow
          key={resource.id}
          title={resource.title}
          meta={`${resource.courseCode} · ${resource.type}`}
          trailing={resource.cached ? "Cached" : "Online"}
        />
      ))}
    </View>
  );
}
