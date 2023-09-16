import { redirect } from "next/navigation";

import { and, between, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { course, grade, instance, lecture, schedule } from "@/db/schema";

function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  const newDate = new Date(d.setDate(diff));
  return new Date(newDate.setUTCHours(0, 0, 0, 0));
}

function getFriday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day <= 5 ? (5 - day) : (12 - day)); // adjust when day is after Friday
  const newDate = new Date(d.setDate(diff));
  return new Date(newDate.setUTCHours(23, 59, 59));
}

export const revalidate = 0;

export default async function Page() {
  const today = new Date();

  // query recurrente. Separar en un archivo y llamar
  const lectures = await db.select().from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(and(
      eq(instance.professorId, 1),
      between(lecture.date, getMonday(today), getFriday(today)),
    ));

  function getClosestLecture() {
    let closerLecture = lectures[0].lecture.id;
    let closerDateDiff = lectures[0].lecture.date.getUTCDate() -
      today.getUTCDate();
    let closerTimeDiff =
      new Date("1970-01-01T" + lectures[0].schedule.startTime).getTime() -
      today.getTime();

    lectures.forEach((lec) => {
      let dateDiff = lec.lecture.date.getUTCDate() - today.getUTCDate();
      let timeDiff =
        new Date("1970-01-01T" + lec.schedule.startTime).getTime() -
        today.getTime();

      if (dateDiff < closerDateDiff) {
        closerLecture = lec.lecture.id;
        closerDateDiff = dateDiff;
        closerTimeDiff = timeDiff;
      } else if (dateDiff === closerDateDiff && timeDiff < closerTimeDiff) {
        closerLecture = lec.lecture.id;
        closerDateDiff = dateDiff;
        closerTimeDiff = timeDiff;
      }
    });
    redirect(`/lecture/${String(closerLecture)}`);
  }

  return (
    <>
      {lectures.length === 0
        ? (
          <section className="flex flex-row justify-center items-center w-full h-full">
            <div className="text-4xl p-4 bg-primary-100 rounded shadow">
              No tenés clases para dictar.
            </div>
          </section>
        )
        : getClosestLecture()}
    </>
  );
}
