import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Fragment } from "react";

import { db } from "@/db/db";
import {
  attendance,
  classroom,
  course,
  grade,
  instance,
  lecture,
  schedule,
  school,
  student,
  user,
  weekdayTranslate,
} from "@/db/schema";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/history/lecture`);
  }

  const query = await db
    .select({
      id: lecture.id,
      date: sql<string>`${lecture.date}`,
      notes: lecture.notes,
      weekday: schedule.weekday,
      classroom: classroom.name,
      course: course.name,
      grade: grade.name,
      professor: user.name,
    })
    .from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(classroom, eq(instance.classroomId, classroom.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(and(
      eq(school.slug, params.slug),
      eq(lecture.id, Number(params.id)),
    ));

  if (query.length !== 1) {
    redirect(`/${params.slug}/history/lecture`);
  }

  const attendances = await db
    .select({
      id: attendance.id,
      isPresent: attendance.isPresent,
      student: sql<
        string
      >`CONCAT_WS(", ", ${student.lastName}, ${student.firstName})`,
    })
    .from(attendance)
    .innerJoin(lecture, eq(attendance.lectureId, lecture.id))
    .innerJoin(student, eq(attendance.studentId, student.id))
    .where(eq(lecture.id, Number(params.id)))
    .orderBy(student.lastName, student.lastName);

  return (
    <>
      <h1 className="text-4xl">Asistencia</h1>
      <p>Materia: {query[0].course}</p>
      <p>Profesor: {query[0].professor}</p>
      <p>Aula: {query[0].classroom}</p>
      <p>Curso: {query[0].grade}</p>
      <p>
        Día: {query[0].date.replaceAll("-", "/")}{" "}
        ({weekdayTranslate[query[0].weekday]})
      </p>
      <h2 className="py-1 text-2xl">Asistencias</h2>
      <ul>
        {attendances.map(({ id, student, isPresent }, i) => (
          <Fragment key={id}>
            <li className="flex justify-between py-1 text-2xl font-mono">
              {student}
              <span>
                {isPresent ? "Presente" : "Ausente"}
              </span>
            </li>
            {i + 1 !== attendances.length && (
              <hr className="border border-neutral-variant-50 dark:border-neutral-variant-60" />
            )}
          </Fragment>
        ))}
      </ul>
      <h2 className="py-1 text-2xl">Observaciones</h2>
      <p className="font-mono">{query[0].notes}</p>
    </>
  );
}
