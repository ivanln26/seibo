import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import {
  grade,
  instance,
  score,
  student,
  studentGrade,
  test,
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
    redirect(`/${params.slug}/test`);
  }

  const exam = await db.query.test.findFirst({
    where: (test, { eq }) => eq(test.id, Number(params.id)),
  });

  if (exam === undefined) {
    redirect(`/${params.slug}/test`);
  }

  const query = await db
    .select({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
      },
      score: {
        id: score.id,
        value: score.score,
      },
    })
    .from(student)
    .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
    .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
    .innerJoin(instance, eq(grade.id, instance.gradeId))
    .innerJoin(test, eq(instance.id, test.instanceId))
    .leftJoin(
      score,
      and(eq(test.id, score.testId), eq(student.id, score.studentId)),
    )
    .where(eq(test.id, Number(params.id)));

  return (
    <>
      <h1 className="text-4xl font-bold">Calificaciones</h1>
      <h2 className="text-2xl py-1">
        Examen: {exam.title} | {format(exam.date, "dd/MM/yyyy")}
      </h2>
      <section className="py-2">
        <h2 className="text-2xl">Alumnos</h2>
        <Form slug={params.slug} testId={Number(params.id)} rows={query} />
      </section>
    </>
  );
}
