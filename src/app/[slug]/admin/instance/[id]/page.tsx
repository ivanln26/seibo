import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import Button from "@/components/button";
import { db } from "@/db/db";
import {
  classroom,
  course,
  courseProfessor,
  grade,
  instance,
  schoolUser,
  user,
} from "@/db/schema";
import { getUserProfile } from "@/db/queries";

type Props = {
  params: {
    slug: string;
    id: number;
  };
};

export default async function Page({ params }: Props) {
  const profile = await getUserProfile({ slug: params.slug });
  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  const actualInstance = await db.query.instance.findFirst({
    where: (instance, { eq }) => eq(instance.id, params.id),
  });
  const actualCourseProfessor = await db.query.courseProfessor.findFirst({
    where: (cp, { eq }) =>
      and(
        eq(cp.courseId, instance.courseId),
        eq(cp.professorId, instance.professorId),
      ),
  });
  if (!profile || !school || !actualInstance) return <>Error</>;

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

  async function updateInstance(data: FormData) {
    "use server";
    const newInstance = z.object({
      id: z.number(),
      courseId: z.number(),
      gradeId: z.number(),
      classroomId: z.number(),
      professorId: z.number(),
    }).safeParse({
      id: Number(params.id),
      courseId: Number(data.get("courseId")),
      gradeId: Number(data.get("gradeId")),
      classroomId: Number(data.get("classroomId")),
      professorId: Number(data.get("professorId")),
    });
    const newCourseProfessor = z.object({
      id: z.number(),
      professorId: z.number(),
      courseId: z.number(),
    }).safeParse({
      id: actualCourseProfessor?.id,
      professorId: Number(data.get("professorId")),
      courseId: Number(data.get("courseId")),
    });
    if (!newInstance.success || !newCourseProfessor.success) return;

    await db.update(instance).set(newInstance.data)
      .where(eq(instance.id, newInstance.data.id));

    await db.update(courseProfessor).set(newCourseProfessor.data)
      .where(eq(courseProfessor.id, newCourseProfessor.data.id));

    redirect(`/${params.slug}/admin/instance`);
  }

  async function deleteInstance() {
    "use server";
    const id = z.number().safeParse(Number(params.id));
    const cpId = z.number().safeParse(Number(actualCourseProfessor?.id));
    if (!id.success || !cpId.success) return;

    await db.delete(instance).where(eq(instance.id, id.data));
    await db.delete(courseProfessor).where(eq(courseProfessor.id, cpId.data));
    redirect(`/${params.slug}/admin/instance`);
  }

  return (
    <>
      <h1 className="text-4xl">Editar clase</h1>
      <div className="bg-primary-100 m-5 p-4 rounded-xl">
        <form action={updateInstance} className="flex flex-col gap-3">
          <label htmlFor="">Materia</label>
          <select
            defaultValue={actualInstance.courseId}
            className="py-4 outline outline-1 outline-outline bg-transparent rounded"
            name="courseId"
            id=""
          >
            {createInstanceData.courses.map((c) => (
              <option value={c.id}>{c.name}</option>
            ))}
          </select>
          <label htmlFor="">Curso</label>
          <select
            defaultValue={actualInstance.gradeId}
            className="py-4 outline outline-1 outline-outline bg-transparent rounded"
            name="gradeId"
            id=""
          >
            {createInstanceData.grades.map((c) => (
              <option value={c.id}>{c.name}</option>
            ))}
          </select>
          <label htmlFor="">Profesor</label>
          <select
            defaultValue={actualInstance.professorId}
            className="py-4 outline outline-1 outline-outline bg-transparent rounded"
            name="professorId"
            id=""
          >
            {createInstanceData.users.map((c) => (
              <option value={c.user.id}>{c.user.name}</option>
            ))}
          </select>
          <label htmlFor="">Aula</label>
          <select
            defaultValue={actualInstance.classroomId}
            className="py-4 outline outline-1 outline-outline bg-transparent rounded"
            name="classroomId"
            id=""
          >
            {createInstanceData.classrooms.map((c) => (
              <option value={c.id}>{c.name}</option>
            ))}
          </select>
          <Button color="tertiary" type="submit">Guardar</Button>
        </form>
        <form className="flex flex-col" action={deleteInstance}>
          <Button type="submit">Borrar</Button>
        </form>
      </div>
    </>
  );
}
