import Link from "next/link";
import { eq, and, between } from "drizzle-orm";

import { db } from "@/db/db";
import { course, grade, instance, lecture, schedule } from "@/db/schema";

function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  const newDate = new Date(d.setDate(diff));
  return new Date(newDate.setUTCHours(0,0,0,0));
}


function getFriday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day <= 5 ? (5 - day) : (12 - day)); // adjust when day is after Friday
  const newDate = new Date(d.setDate(diff));
  return new Date(newDate.setUTCHours(23,59,59)); 
}

export default async function LecturePicker() {
  const d = new Date()
  const lectures = await db.select().from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(and(
      eq(instance.professorId, 1),
      between(lecture.date, getMonday(d), getFriday(d))
    ))
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
