import { db } from "@/db/db";
import { course, grade, instance, schedule, user as User } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { getUser } from "../lecture/utils";
import Modal from "@/components/modal";
import TextField from "@/components/text-field";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import TimeInput from "./time-input";

export default async function Page() {
  const session = await getServerSession();
  if (!session) return (<>Error al obtener la sesión.</>)
  const user = await getUser(session);
  if (!user) return <>Error al obtener el usuario.</>
  const schedules = await db.select()
    .from(schedule)
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(and(
      eq(course.schoolId, 1)
    ))

  async function createSchedule(data: FormData) {
    "use server"
    const t = z.object({
      instanceID: z.number(),
      weekday: z.enum(["monday", "tuesday","wednesday", "thursday", "friday"]),
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

    await db.insert(schedule).values({
      instanceId: newSchedule.data.instanceID,
      weekday: newSchedule.data.weekday,
      startTime:newSchedule.data.startTime,
      endTime: newSchedule.data.endTime
    })
    revalidatePath("/schedule");
  }

  const instances = await db.select().from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(User, eq(instance.professorId, User.id))
    .where(eq(course.schoolId, 1))
  return (
    <section className="flex flex-col gap-5 ml-2">
      <h1 className="text-4xl">Horarios</h1>
      <div className="w-full">
        <table className="w-full">
          <tbody>
            <tr className="bg-primary-100">
              <td className="border border-black">Materia</td>
              <td className="border border-black">Dia de la semana</td>
              <td className="border border-black">Hora</td>
              <td className="border border-black">Curso</td>
            </tr>
            {schedules.map((s) => <tr>
              <td className="border border-black">{s.course.name}</td>
              <td className="border border-black">{s.schedule.weekday}</td>
              <td className="border border-black">{s.schedule.startTime} - {s.schedule.endTime}</td>
              <td className="border border-black">{s.grade.name}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="fixed bottom-5 right-10">
        <form action={createSchedule}>
          <Modal buttonText="Crear" confirmButton={{ text: "sape", type: "submit" }}>
            <h1 className="text-2xl">Crear horario</h1>
            <label htmlFor="">Clase</label>
            <select name="instanceID" className="py-4 outline outline-1 rounded bg-white outline-outline">
              {instances.map((i) => <option value={Number(i.instance.id)}>{i.course.name} | {i.grade.name} | {i.user.name}</option>)}
            </select>
            <label htmlFor="">Dia de la semana</label>
            <select name="weekday" className="py-4 outline outline-1 rounded bg-white outline-outline">
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
      </div>
    </section>
  );
}
