import { and, desc, eq, like, sql } from "drizzle-orm";

import { db } from "@/db/db";
import {
  classroom,
  course,
  grade,
  instance,
  lecture,
  schedule,
  school,
  user,
} from "@/db/schema";
import Table, { querySchema } from "@/components/table";

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
      id: lecture.id,
      date: sql<string>`${lecture.date}`,
      weekday: schedule.weekday,
      classroom: classroom.name,
      course: course.name,
      grade: grade.name,
      professor: user.name,
    })
    .from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(classroom, eq(instance.classroomId, classroom.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(and(
      eq(school.slug, params.slug),
      queryParams.query !== ""
        ? like(user.name, `%${queryParams.query}%`)
        : undefined,
    ))
    .orderBy(desc(lecture.id))
    .limit(queryParams.limit)
    .offset((queryParams.page - 1) * queryParams.limit);

  return (
    <Table
      title="Asistencias"
      data={query}
      columns={[
        // { attr: "id", name: "ID" },
        { attr: "date", name: "Fecha" },
        { attr: "course", name: "Materia" },
        { attr: "grade", name: "Curso" },
        { attr: "classroom", name: "Aula" },
        { attr: "professor", name: "Profesor" },
        {attr: "icon", name:"Detalle"}
      ]}
      href={`/${params.slug}/history/lecture`}
      detail="id"
      page={queryParams.page}
      limit={queryParams.limit}
    />
  );
}
