import { and, eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import Modal from "@/components/modal";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import {
  classroom,
  course,
  grade,
  instance,
  schoolUser,
  user,
} from "@/db/schema";
import Select from "@/components/select";

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

  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (school === undefined) redirect("/");

  const instances = await db
    .select({
      id: instance.id,
      course: course.name,
      grade: grade.name,
      professor: user.name,
      classroom: classroom.name,
    })
    .from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .innerJoin(classroom, eq(instance.classroomId, classroom.id))
    .where(and(
      eq(grade.schoolId, school.id),
      queryParams.query !== ""
        ? or(
          like(course.name, `%${queryParams.query}%`),
          like(user.name, `%${queryParams.query}%`),
        )
        : undefined,
    ))
    .limit(queryParams.limit)
    .offset((queryParams.page - 1) * queryParams.limit);

  const createInstanceData = {
    courses: await db.select().from(course).where(
      eq(course.schoolId, school.id),
    ),
    grades: await db.select().from(grade).where(eq(grade.schoolId, school.id)),
    users: await db.select().from(user).innerJoin(
      schoolUser,
      eq(user.id, schoolUser.userId),
    )
      .where(and(
        eq(schoolUser.schoolId, school.id),
        and(eq(schoolUser.isActive, true), eq(schoolUser.role, "teacher")),
      )),
    classrooms: await db.select().from(classroom).where(
      eq(classroom.schoolId, school.id),
    ),
  };

  const create = async (data: FormData) => {
    "use server";
    const newInstance = z.object({
      courseId: z.coerce.number(),
      gradeId: z.coerce.number(),
      classroomId: z.coerce.number(),
      professorId: z.coerce.number(),
    }).safeParse({
      courseId: data.get("course"),
      gradeId: data.get("grade"),
      classroomId: data.get("classroom"),
      professorId: data.get("professor"),
    });

    if (!newInstance.success) return;

    await db.insert(instance).values(newInstance.data);
    revalidatePath(`/${params.slug}/admin/instance`);
  };

  return (
    <>
      <Table
        title="Clases"
        data={instances}
        columns={[
          { attr: "id", name: "ID" },
          { attr: "course", name: "Materia" },
          { attr: "grade", name: "Curso" },
          { attr: "professor", name: "Profesor" },
          { attr: "classroom", name: "Aula" },
        ]}
        href={`/${params.slug}/admin/instance`}
        detail="id"
        page={queryParams.page}
        limit={queryParams.limit}
      />
      <form
        className="fixed bottom-5 right-5 md:right-10"
        action={create}
      >
        <Modal
          buttonText="Crear"
          confirmButton={{ text: "Crear", type: "submit" }}
        >
          <h1 className="text-2xl">Crear clase</h1>
          <div className="flex flex-col gap-3">
            <Select
              id="course"
              name="course"
              label="Materia"
              required
              options={createInstanceData.courses.map((c) => ({
                value: c.id,
                description: c.name,
              }))}
            />
            <Select
              id="grade"
              name="grade"
              label="Materia"
              required
              options={createInstanceData.grades.map((g) => ({
                value: g.id,
                description: g.name,
              }))}
            />
            <Select
              id="professor"
              name="professor"
              label="Profesor"
              required
              options={createInstanceData.users.map((u) => ({
                value: u.user.id,
                description: u.user.name,
              }))}
            />
            <Select
              id="classroom"
              name="classroom"
              label="Aula"
              required
              options={createInstanceData.classrooms.map((c) => ({
                value: c.id,
                description: c.name,
              }))}
            />
          </div>
        </Modal>
      </form>
    </>
  );
}
