import { headers } from "next/headers";
import { redirect } from 'next/navigation'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import {
  attendance,
  lecture,
  student,
} from "@/db/schema";

import LecturePicker from "./lecturePicker"
import Button from "@/components/button";
import Modal from "@/components/modal";
import Switch from "@/components/switch"

export default async function Page() {
  const pathName = headers().get("x-invoke-path") || "";
  const lectureID = pathName.split("").pop()
  const today = new Date();
  const monthName = format(today, 'MMMM', { locale: es });

  const attendances = await db.select()
    .from(attendance)
    .innerJoin(student, eq(attendance.studentId, student.id))
    .where(eq(attendance.lectureId, Number(lectureID)));

  async function updateAssistances(formData: FormData) {
    'use server'
    const data = formData.entries();
    data.next();
    for (let pair of data) {
      await db.update(attendance)
        .set({ isPresent: pair[1] === "on" })
        .where(eq(attendance.id, Number(pair[0])))
    }
    // redirect(pathName)
  }

  return (
    <div className="flex flex-col gap-5 h-screen mx-2">
      <h1 className="text-4xl">
        Asistencias - {today.getDate()} de {monthName} de {today.getFullYear()}
      </h1>
      <h2 className="text-2xl">Clases</h2>
      <section className="flex flex-row gap-5 overflow-x-auto w-screen md:w-max text-center">
        <LecturePicker />
      </section>
      <section className="flex px-4 flex-col gap-2 mt-2 w-screen md:w-[1080px] ">
        <form action={updateAssistances}>
          {attendances.map((a) => {
            return (
              <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
                <p className="text-xl">{a.student.lastName}, {a.student.firstName}</p>
                <Switch id={String(a.attendance.id)} name={String(a.attendance.id)} checked={a.attendance.isPresent} />
              </div>
            )
          })}
          <div className="fixed bottom-2 right-5 flex flex-row gap-5">
            <Button color="error" kind="tonal">Deshacer</Button>
            <Modal buttonText="Guardar">
              <Button type="submit">guardar</Button>
            </Modal>
          </div>
        </form>
      </section>
    </div>
  );
}
