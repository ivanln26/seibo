import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Fragment } from "react";

import { db } from "@/db/db";
import {
  classroom,
  course,
  grade,
  instance,
  school,
  score,
  student,
  test,
  user,
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
    redirect(`/${params.slug}/history/test`);
  }

  const query = await db
    .select({
      id: test.id,
      title: test.title,
      topics: test.topics,
      date: sql<string>`${test.date}`,
      classroom: classroom.name,
      course: course.name,
      grade: grade.name,
      professor: user.name,
    })
    .from(test)
    .innerJoin(instance, eq(test.instanceId, instance.id))
    .innerJoin(classroom, eq(instance.classroomId, classroom.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(and(
      eq(school.slug, params.slug),
      eq(test.id, Number(params.id)),
    ));

  if (query.length !== 1) {
    redirect(`/${params.slug}/history/test}`);
  }

  const scores = await db
    .select({
      id: score.id,
      score: score.score,
      student: sql<
        string
      >`CONCAT_WS(", ", ${student.lastName}, ${student.firstName})`,
    })
    .from(score)
    .innerJoin(test, eq(score.testId, test.id))
    .innerJoin(student, eq(score.studentId, student.id))
    .where(eq(test.id, Number(params.id)))
    .orderBy(student.lastName, student.firstName);

  return (
    <>
      <h1 className="text-4xl">Examen</h1>
      <p>Título: {query[0].title}</p>
      <p>Materia: {query[0].course}</p>
      <p>Profesor: {query[0].professor}</p>
      <p>Aula: {query[0].classroom}</p>
      <p>Curso: {query[0].grade}</p>
      <p>Día: {query[0].date}</p>
      <h2 className="py-1 text-2xl">Notas</h2>
      {scores.length === 0
        ? (
          <p className="text-error-600 dark:text-error-200">
            No se cargaron notas.
          </p>
        )
        : (
          <ul>
            {scores.map(({ id, student, score }, i) => (
              <Fragment key={id}>
                <li className="flex justify-between py-1 text-2xl font-mono">
                  {student}
                  <span>{score}</span>
                </li>
                {i + 1 !== scores.length && (
                  <hr className="border border-neutral-variant-50 dark:border-neutral-variant-60" />
                )}
              </Fragment>
            ))}
          </ul>
        )}
    </>
  );
}
