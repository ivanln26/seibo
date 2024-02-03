import { and, eq } from "drizzle-orm";

import Form from "./form";
import { db } from "@/db/db";
import {
  grade,
  instance,
  school,
  student,
  studentGrade,
  user,
} from "@/db/schema";
import type { Grade, Student } from "@/db/schema";
import { getUserProfile, hasRoles } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const userProfile = await getUserProfile({ slug: params.slug });
  const isAdminOrPrincipal = await hasRoles(
    userProfile,
    "OR",
    "admin",
    "principal",
  );
  const isTeacher = await hasRoles(userProfile, "OR", "teacher");

  let query: { grade: Grade; student: Student }[] = [];
  if (isAdminOrPrincipal) {
    query = await db
      .select({ grade, student })
      .from(grade)
      .innerJoin(studentGrade, eq(grade.id, studentGrade.gradeId))
      .innerJoin(student, eq(studentGrade.studentId, student.id))
      .innerJoin(school, eq(grade.schoolId, school.id))
      .where(eq(school.slug, params.slug));
  } else if (isTeacher) {
    query = await db
      .selectDistinct({ grade, student })
      .from(grade)
      .innerJoin(studentGrade, eq(grade.id, studentGrade.gradeId))
      .innerJoin(student, eq(studentGrade.studentId, student.id))
      .innerJoin(school, eq(grade.schoolId, school.id))
      .innerJoin(instance, eq(grade.id, instance.gradeId))
      .innerJoin(user, eq(instance.professorId, user.id))
      .where(
        and(
          eq(school.slug, params.slug),
          eq(user.id, userProfile.id),
        ),
      );
  }

  const studentsByGrade = query.reduce<Record<string, Student[]>>(
    (res, { grade, student }) => {
      if (grade.name in res) {
        res[grade.name].push(student);
      } else {
        res[grade.name] = [student];
      }
      return res;
    },
    {},
  );

  return (
    <Form
      user={userProfile}
      slug={params.slug}
      studentsByGrade={studentsByGrade}
    />
  );
}
