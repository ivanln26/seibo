import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import Button from "@/components/button";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import {
  grade,
  school,
  student,
  studentContact,
  studentGrade,
} from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/student`);
  }

  const query = await db
    .select()
    .from(student)
    .innerJoin(school, eq(student.schoolId, school.id))
    .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
    .leftJoin(studentContact, eq(student.id, studentContact.studentId)) // FIXME: puede tener muchos contactos, por lo que la query puede devolver mas de 1.
    .where(
      and(
        // eq(school.slug, params.slug),
        eq(student.id, Number(params.id)),
      ),
    );

  if (query.length !== 1) {
    redirect(`/${params.slug}/admin/student`);
  }

  const grades = await db
    .select()
    .from(grade)
    .where(eq(grade.schoolId, query[0].school.id));

  return (
    <section>
      <h1 className="text-4xl">Modificar alumno</h1>
      <Form
        slug={params.slug}
        student={query[0].student}
        studentGrade={query[0].student_grade}
        studentContact={query[0].student_contact}
        grades={grades}
      />
    </section>
  );
}
