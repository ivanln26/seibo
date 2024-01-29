import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { course, grade, instance, schedule, school, user } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/schedule`);
  }

  const query = await db
    .select({ schedule })
    .from(schedule)
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(school, eq(course.schoolId, school.id))
    .where(
      and(
        eq(school.slug, params.slug),
        eq(schedule.id, Number(params.id)),
      ),
    );

  if (query.length !== 1) {
    redirect(`/${params.slug}/admin/schedule`);
  }

  // Ignore seconds
  query[0].schedule.startTime = query[0].schedule.startTime.substring(0, 5);
  query[0].schedule.endTime = query[0].schedule.endTime.substring(0, 5);

  const instances = await db
    .select({
      id: instance.id,
      course: course.name,
      grade: grade.name,
      professor: user.name,
    })
    .from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(school, eq(course.schoolId, school.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .where(eq(school.slug, params.slug));

  return (
    <>
      <h1 className="text-4xl">Modificar horario</h1>
      <Form
        slug={params.slug}
        schedule={query[0].schedule}
        instances={instances}
      />
    </>
  );
}
