import Link from "next/link";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { course, grade, instance, lecture, schedule } from "@/db/schema";

export default async function LecturePicker() {
  const lectures = await db.select().from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(eq(instance.professorId, 1))
    .orderBy(schedule.weekday, schedule.startTime);

  return lectures.map((l) => {
    return (
      <Link href={`/lecture/${l.lecture.id}`}>
        <div className="p-5 px-6 m-2 border rounded-xl w-max flex flex-col font-bold">
          <p>{l.course.name}</p>
          <p>{l.grade.name}</p>
          <p>{l.schedule.weekday}</p>
          <p>{l.schedule.startTime} - {l.schedule.endTime}</p>
        </div>
      </Link>
    );
  });
}
