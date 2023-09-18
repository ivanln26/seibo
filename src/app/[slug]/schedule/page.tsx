import { db } from "@/db/db";
import { course, grade, instance, schedule } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { getUser } from "../lecture/utils";

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
      eq(instance.professorId, user.id)
    ))
  console.log(schedules)
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
    </section>
  );
}
