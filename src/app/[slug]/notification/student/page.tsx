import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { grade, student, studentGrade } from "@/db/schema";

import Form from "./form";
import { getSchool, getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const school = await getSchool({ slug: params.slug });
  const grades = await db.select()
    .from(grade)
    .where(eq(grade.schoolId, school.id));
  const students = await db
    .select({
      id: student.id,
      schoolId: student.schoolId,
      studentCode: student.studentCode,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      gradeId: grade.id,
    })
    .from(student)
    .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
    .innerJoin(grade, eq(studentGrade.gradeId, grade.id));

  return <Form grades={grades} students={students} />;
}
