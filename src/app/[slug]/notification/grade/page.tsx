import { and, eq } from "drizzle-orm";

import Form from "./form";
import { db } from "@/db/db";
import { grade, instance, school, user } from "@/db/schema";
import type { Grade } from "@/db/schema";
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

  const selectData = {
    id: grade.id,
    schoolId: grade.schoolId,
    name: grade.name,
  };
  let grades: Grade[] = [];
  if (isAdminOrPrincipal) {
    grades = await db
      .select(selectData)
      .from(grade)
      .innerJoin(school, eq(grade.schoolId, school.id))
      .where(eq(school.slug, params.slug));
  } else if (isTeacher) {
    grades = await db
      .selectDistinct(selectData)
      .from(grade)
      .innerJoin(school, eq(grade.schoolId, school.id))
      .innerJoin(instance, eq(grade.id, instance.gradeId))
      .innerJoin(user, eq(instance.professorId, user.id))
      .where(
        and(
          eq(school.slug, params.slug),
          !isAdminOrPrincipal && isTeacher
            ? eq(user.id, userProfile.id)
            : undefined,
        ),
      );
  }
  // TODO: add isTutor

  return <Form user={userProfile} slug={params.slug} grades={grades} />;
}
