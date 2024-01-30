import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { schoolUser, user } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/classroom`);
  }

  // FIXME: checkear que la instance sea de la misma escuela.
  const instance = await db.query.instance.findFirst({
    where: (instance, { eq }) => eq(instance.id, Number(params.id)),
  });

  if (!instance) {
    redirect(`/${params.slug}/admin/instance`);
  }

  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (!school) {
    redirect("/");
  }

  const courses = await db.query.course.findMany({
    where: (course, { eq }) => eq(course.schoolId, school.id),
  });

  const classrooms = await db.query.classroom.findMany({
    where: (classroom, { eq }) => eq(classroom.schoolId, school.id),
  });

  const professors = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .where(
      and(
        eq(schoolUser.isActive, true),
        eq(schoolUser.role, "teacher"),
        eq(schoolUser.schoolId, school.id),
      ),
    );

  const grades = await db.query.grade.findMany({
    where: (grade, { eq }) => eq(grade.schoolId, school.id),
  });

  return (
    <>
      <h1 className="text-4xl">Modificar clase</h1>
      <Form
        slug={params.slug}
        instance={instance}
        courses={courses}
        classrooms={classrooms}
        professors={professors}
        grades={grades}
      />
    </>
  );
}
