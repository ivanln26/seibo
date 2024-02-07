import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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
import { getUserProfile } from "@/db/queries";

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
  const query = querySchema.parse(searchParams);

  const profile = await getUserProfile({ slug: params.slug });
  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });
  if (!profile || !school) return <>Error</>;

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
    .innerJoin(classroom, eq(instance.classroomId, classroom.id));

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

  async function createInstance(data: FormData) {
    "use server";
    const newInstance = z.object({
      courseId: z.number(),
      gradeId: z.number(),
      classroomId: z.number(),
      professorId: z.number(),
    }).safeParse({
      courseId: Number(data.get("courseId")),
      gradeId: Number(data.get("gradeId")),
      classroomId: Number(data.get("classroomId")),
      professorId: Number(data.get("professorId")),
    });

    if (!newInstance.success) return;

    await db.insert(instance).values(newInstance.data);
    revalidatePath(`/${params.slug}/admin/instance`);
  }

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
        page={query.page}
        limit={query.limit}
      />
      <form
        className="fixed bottom-5 right-5 md:right-10"
        action={createInstance}
      >
        <Modal
          buttonText="Crear"
          confirmButton={{ text: "Crear", type: "submit" }}
        >
          <h1 className="text-2xl">Crear clase</h1>
          <div className="flex flex-col gap-3">
            <label htmlFor="">Materia</label>
            <select
              className="py-4 outline outline-1 outline-outline bg-transparent rounded"
              name="courseId"
              id=""
            >
              <option value="">---</option>
              {createInstanceData.courses.map((c) => (
                <option value={c.id}>{c.name}</option>
              ))}
            </select>
            <label htmlFor="">Curso</label>
            <select
              className="py-4 outline outline-1 outline-outline bg-transparent rounded"
              name="gradeId"
              id=""
            >
              <option value="">---</option>
              {createInstanceData.grades.map((c) => (
                <option value={c.id}>{c.name}</option>
              ))}
            </select>
            <label htmlFor="">Profesor</label>
            <select
              className="py-4 outline outline-1 outline-outline bg-transparent rounded"
              name="professorId"
              id=""
            >
              <option value="">---</option>
              {createInstanceData.users.map((c) => (
                <option value={c.user.id}>{c.user.name}</option>
              ))}
            </select>
            <label htmlFor="">Aula</label>
            <select
              className="py-4 outline outline-1 outline-outline bg-transparent rounded"
              name="classroomId"
              id=""
            >
              <option value="">---</option>
              {createInstanceData.classrooms.map((c) => (
                <option value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </Modal>
      </form>
    </>
  );
}
