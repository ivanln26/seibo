import { and, eq, sql } from "drizzle-orm";

import Canvas from "./canvas";
import { db } from "@/db/db";
import { attendance, grade, instance, lecture, schedule, school, student, studentGrade } from "@/db/schema";
import Attendances from "./attendances";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const query = await db
    .select({
      gradeId: grade.id,
      grade: grade.name,
      count: sql<number>`count(${studentGrade.studentId})`,
    })
    .from(studentGrade)
    .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(eq(school.slug, params.slug))
    .groupBy(({ gradeId }) => gradeId);

  const attendances = await db.select({
    gradeId: grade.id,
    grade: grade.name,
    isPresent: attendance.isPresent,
    count: sql<number>`count(${attendance.id})`,
  }).from(attendance)
    .innerJoin(lecture, eq(attendance.lectureId, lecture.id))
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(and(eq(attendance.isPresent, true), eq(school.slug, params.slug)))
    .groupBy(grade.id);

  const notAttendances = await db.select({
    gradeId: grade.id,
    grade: grade.name,
    isPresent: attendance.isPresent,
    count: sql<number>`count(${attendance.id})`,
  }).from(attendance)
    .innerJoin(lecture, eq(attendance.lectureId, lecture.id))
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(and(eq(attendance.isPresent, false), eq(school.slug, params.slug)))
    .groupBy(grade.id);

  const all = attendances.concat(notAttendances).sort((a, b) => a.gradeId - b.gradeId)
  console.log(all)
  return (
    <>
      <div className="grid grid-cols-4 gap-5">
        <div className="">
          <h1 className="text-center text-xl">Cantidad de alumnos por curso</h1>
          <Canvas data={query} />
        </div>
        <div className="">
          <h1 className="text-center text-xl">Cantidad de alumnos por curso</h1>
          <Canvas data={query} />
        </div>
        <div className="">
          <h1 className="text-center text-xl">Cantidad de alumnos por curso</h1>
          <Canvas data={query} />
        </div>
        <div className="">
          <h1 className="text-center text-xl">Cantidad de alumnos por curso</h1>
          <Canvas data={query} />
        </div>
        <div className="col-span-2 row-span-2 flex flex-col">
          <h1 className="text-center text-xl">Cantidad de asistencias / inasistencias por curso</h1>
          <Attendances data={all} />
        </div>
      </div>
    </>
  );
}
