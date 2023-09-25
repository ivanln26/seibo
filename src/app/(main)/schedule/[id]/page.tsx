import { db } from "@/db/db";
import { course, grade, instance, schedule, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import TextField from "@/components/text-field";
import Button from "@/components/button";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: number;
  };
};

const weekdays = [
  { name: "Lunes", value: "monday" },
  { name: "Martes", value: "tuesday" },
  { name: "Miercoles", value: "wednesday" },
  { name: "Jueves", value: "thursday" },
  { name: "Viernes", value: "friday" },
]

export default async function Page({ params }: Props) {

  const sched = await db.select().from(schedule).where(eq(schedule.id, params.id))
  const instances = await db.select().from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .where(eq(course.schoolId, 1))

  async function save(data: FormData) {
    "use server"
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
      console.log("error", newSchedule.error)
      return;
    }

    await db.update(schedule).set({
      instanceId: newSchedule.data.instanceID,
      weekday: newSchedule.data.weekday,
      startTime: newSchedule.data.startTime,
      endTime: newSchedule.data.endTime
    }).where(eq(schedule.id, newSchedule.data.instanceID))
    revalidatePath("/schedule");
  }
  async function deleteSchedule() {
    "use server"
    await db.delete(schedule)
      .where(eq(schedule.id, sched[0].id))
    redirect("/schedule")
  }
  return (
    <>
      <h1 className="text-4xl">Modificar Horario</h1>
      <div className="div rounded-xl bg-primary-100 w-full m-5 py-3 px-4">
        <form action={save} className="flex flex-col gap-5">
          <label htmlFor="">Clase</label>
          <select name="instanceID" className="py-4 outline outline-1 rounded bg-white outline-outline">
            {instances.map((i) => <option value={Number(i.instance.id)}>{i.course.name} | {i.grade.name} | {i.user.name}</option>)}
          </select>
          <label htmlFor="">Dia de la semana</label>
          <select name="weekday" className="py-4 outline outline-1 rounded bg-white outline-outline" defaultValue={sched[0].weekday}>
            {
              weekdays.map((w) => <option value={w.value} >{w.name}</option>)
            }
          </select>
          <TextField label="Hora de inicio" id="Start time" name="startTime" defaultValue={sched[0].startTime}></TextField>
          <TextField label="Hora de Fin" id="Start time" name="endTime" defaultValue={sched[0].endTime}></TextField>
          <Button type="submit" color="tertiary">Guardar</Button>
        </form>
        <form action={deleteSchedule} className="flex flex-col my-5">
          <Button type="submit">Borrar</Button>
        </form>
      </div>
    </>
  )
}