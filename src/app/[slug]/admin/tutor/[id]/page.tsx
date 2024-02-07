import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { grade, gradeTutor, school, schoolUser, user } from "@/db/schema";
import type { User } from "@/db/schema";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/tutor`);
  }

  const query = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: schoolUser.isActive,
      gradeId: gradeTutor.gradeId,
    })
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .innerJoin(school, eq(schoolUser.schoolId, school.id))
    .leftJoin(gradeTutor, eq(user.id, gradeTutor.tutorId))
    .where(and(
      eq(school.slug, params.slug),
      eq(schoolUser.role, "tutor"),
      eq(user.id, Number(params.id)),
    ));

  if (query.length === 0) {
    redirect(`/${params.slug}/admin/tutor`);
  }

  const tutor = query.reduce<User & { isActive: boolean; gradeIds: number[] }>(
    (t, { gradeId }) => {
      if (gradeId !== null) t.gradeIds.push(gradeId);
      return t;
    },
    {
      id: query[0].id,
      name: query[0].name,
      email: query[0].email,
      isActive: query[0].isActive,
      gradeIds: [],
    },
  );

  const grades = await db
    .select({
      id: grade.id,
      name: grade.name,
      schoolId: grade.schoolId,
    })
    .from(grade)
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(eq(school.slug, params.slug));

  return (
    <>
      <h1 className="text-4xl">Modificar preceptor</h1>
      <Form slug={params.slug} tutor={tutor} grades={grades} />
    </>
  );
}
