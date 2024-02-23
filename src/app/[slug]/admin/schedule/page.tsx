import { and, eq, like, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import TimeInput from "./time-input";
import Modal from "@/components/modal";
import Select from "@/components/select";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import {
  course,
  grade,
  instance,
  schedule,
  user as User,
  weekdays,
  weekdayTranslate,
} from "@/db/schema";

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

  const schedules = await db
    .select({
      id: schedule.id,
      weekday: schedule.weekday,
      time: sql<
        string
      >`concat_ws(" - ", ${schedule.startTime}, ${schedule.endTime})`,
      course: course.name,
      grade: grade.name,
    })
    .from(schedule)
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(and(
      eq(course.schoolId, school.id),
      queryParams.query !== ""
        ? like(course.name, `%${queryParams.query}%`)
        : undefined,
    ))
    .orderBy(schedule.id)
    .limit(queryParams.limit)
    .offset((queryParams.page - 1) * queryParams.limit);

  const instances = await db
    .select()
    .from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(User, eq(instance.professorId, User.id))
    .where(eq(course.schoolId, school.id));

  const create = async (data: FormData) => {
    "use server";
    const t = z.object({
      instanceID: z.number(),
      weekday: z.enum(weekdays),
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
    revalidatePath(`/${params.slug}/admin/schedule`);
  };

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
          <h1 className="text-2xl">Crear horario</h1>
          <Select
            id="instanceID"
            name="instanceID"
            label="Clase"
            required
            options={instances.map((i) => ({
              value: i.instance.id,
              description:
                `${i.course.name} | ${i.grade.name} | ${i.user.name}`,
            }))}
          />
          <Select
            id="weekday"
            name="weekday"
            label="Día de la semana"
            required
            options={Object.entries(weekdayTranslate).map((
              [value, description],
            ) => ({
              value,
              description,
            }))}
          />
          <label htmlFor="startTime">Hora de inicio*</label>
          <TimeInput id="startTime" name="startTime" />
          <label htmlFor="endTime">Hora de fin*</label>
          <TimeInput id="endTime" name="endTime" />
        </Modal>
      </form>
    </>
  );
}
