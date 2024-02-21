import { and, desc, eq, like, or, sql } from "drizzle-orm";

import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import {
  classroom,
  course,
  grade,
  instance,
  school,
  test,
  user,
} from "@/db/schema";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    query?: string;
  };
};

export default async function Page({ params, searchParams }: Props) {
  const queryParams = querySchema.parse(searchParams);

  const query = await db
    .select({
      id: test.id,
      title: test.title,
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
      queryParams.query !== ""
        ? or(
          like(user.name, `%${queryParams.query}%`),
          like(course.name, `%${queryParams.query}%`),
        )
        : undefined,
    ))
    .orderBy(desc(test.id))
    .limit(queryParams.limit)
    .offset((queryParams.page - 1) * queryParams.limit);

  return (
    <Table
      title="Exámenes"
      data={query}
      columns={[
        { attr: "id", name: "ID" },
        { attr: "title", name: "Título" },
        { attr: "date", name: "Fecha" },
        { attr: "course", name: "Materia" },
        { attr: "grade", name: "Curso" },
        { attr: "classroom", name: "Aula" },
        { attr: "professor", name: "Profesor" },
      ]}
      href={`/${params.slug}/history/test`}
      detail="id"
      page={queryParams.page}
      limit={queryParams.limit}
    />
  );
}
