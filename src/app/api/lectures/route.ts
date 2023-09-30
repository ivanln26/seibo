import { db } from "@/db/db";
import { lecture, schedule } from "@/db/schema";
import { between, eq } from "drizzle-orm";

function obtenerFechaSiguiente(diaSemana: number): Date {
  // Obtener la fecha actual
  const fechaActual = new Date();

  // Calcular la diferencia de días hasta el próximo día de la semana
  const diasHastaSiguienteDia = (diaSemana + 7 - fechaActual.getDay()) % 7;

  // Calcular la fecha del próximo día de la semana
  const fechaSiguiente = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    fechaActual.getDate() + diasHastaSiguienteDia
  );

  return fechaSiguiente;
}

export async function GET(request: Request) {
  const schedules = await db.select()
    .from(schedule)
  const fechasSemanaSiguiente = {
    "monday": obtenerFechaSiguiente(1),
    "tuesday": obtenerFechaSiguiente(2),
    "wednesday": obtenerFechaSiguiente(3),
    "thursday": obtenerFechaSiguiente(4),
    "friday": obtenerFechaSiguiente(5),
  };

  const nextWeekLectures = await db.select()
    .from(lecture)
    .where(
      between(lecture.date,
        fechasSemanaSiguiente["monday"],
        fechasSemanaSiguiente["friday"])
    )
  if (nextWeekLectures.length > 0) {
    return new Response("Las clases de la siguiente semana ya fueron creadas.")
  }

  for (let sch of schedules) {
    await db.insert(lecture).values([
      {
        date: fechasSemanaSiguiente[sch.weekday],
        scheduleId: sch.id
      },])
  }
  return new Response("Clases creadas con exito.");
}
