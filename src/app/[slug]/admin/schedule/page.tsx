import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import TimeInput from "./time-input";
import Modal from "@/components/modal";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import { course, grade, instance, schedule, user as User } from "@/db/schema";

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

  const actualSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });
  if (!actualSchool) return <>Error al obtener el usuario.</>;

  const schedules = await db
    .select({
      id: schedule.id,
      weekday: schedule.weekday,
      time: sql`concat_ws(" - ", ${schedule.startTime}, ${schedule.endTime})`,
      course: course.name,
      grade: grade.name,
    })
    .from(schedule)
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(and(
      eq(course.schoolId, actualSchool.id),
    ));

  async function createSchedule(data: FormData) {
    "use server";
    const t = z.object({
      instanceID: z.number(),
      weekday: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]),
      startTime: z.string(),
      endTime: z.string(),
    });
    const newSchedule = t.safeParse({
      instanceID: Number(data.get("instanceID")),
      weekday: data.get("weekday"),
      startTime: data.get("startTime"),
      endTime: data.get("endTime"),
    });
    if (!newSchedule.success) {
      return;
    }

    await db.insert(schedule).values({
      instanceId: newSchedule.data.instanceID,
      weekday: newSchedule.data.weekday,
      startTime: newSchedule.data.startTime,
      endTime: newSchedule.data.endTime,
    });
    revalidatePath(`${params.slug}/schedule`);
  }

  const instances = await db.select().from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(User, eq(instance.professorId, User.id))
    .where(eq(course.schoolId, actualSchool.id));
  return (
    <>
      <Table
        title="Horarios"
        data={schedules}
        columns={[
          { attr: "id", name: "ID" },
          { attr: "weekday", name: "Día de la semana" },
          { attr: "time", name: "Hora" },
          { attr: "grade", name: "Curso" },
          { attr: "course", name: "Materia" },
        ]}
        href={`/${params.slug}/admin/schedule`}
        detail="id"
        page={query.page}
        limit={query.limit}
      />
      <form className="fixed bottom-10 right-10" action={createSchedule}>
        <Modal
          buttonText="Crear"
          confirmButton={{ text: "Crear", type: "submit" }}
        >
          <h1 className="text-2xl">Crear horario</h1>
          <label htmlFor="">Clase</label>
          <select
            name="instanceID"
            className="py-4 outline outline-1 rounded outline-outline bg-transparent"
          >
            {instances.map((i) => (
              <option value={Number(i.instance.id)}>
                {i.course.name} | {i.grade.name} | {i.user.name}
              </option>
            ))}
          </select>
          <label htmlFor="">Dia de la semana</label>
          <select
            name="weekday"
            className="py-4 outline outline-1 rounded outline-outline bg-transparent"
          >
            <option value="monday">Lunes</option>
            <option value="tuesday">Martes</option>
            <option value="wednesday">Miercoles</option>
            <option value="thursday">Jueves</option>
            <option value="friday">Viernes</option>
          </select>
          <label htmlFor="">Hora de inicio</label>
          <TimeInput name="startTime" />
          <label htmlFor="">Hora de fin</label>
          <TimeInput name="endTime" />
        </Modal>
      </form>
    </>
  );
}
