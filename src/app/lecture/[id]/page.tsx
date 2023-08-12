import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { updateAssistances } from "./updateAssistances";
import { getLectureCourses, getAttendances, getStudents } from "./queries";

import AssistanceRow from "./AssistanceRow";
import LecturePicker from "./lecturePicker"
import Button from "@/components/button";
import Modal from "@/components/modal";
import UndoButton from "./undoButton";

export default async function Page() {
  const pathName = headers().get("x-invoke-path") || "";
  const lectureID = Number(pathName.split("/").pop())
  const today = new Date();
  const monthName = format(today, 'MMMM', { locale: es });

  const lectureCourse = await getLectureCourses(lectureID)
  const attendances = await getAttendances(lectureID)
  const students = await getStudents(lectureCourse[0].instance.courseId)

  {/* TODO: Añadir logica en caso de que añada un NUEVO alumno 
  al curso y la lista ya este creada */}
  const listIsCreated = students.length === attendances.length;

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
          <input type="hidden" name="lectureID" value={lectureID} />
          <input type="hidden" name="listIsCreated" value={Number(listIsCreated)} />
          {listIsCreated ? attendances.map((a) => {
            return <AssistanceRow firstName={a.student.firstName}
              lastName={a.student.lastName} id={String(a.attendance.id)}
              isPresent={a.attendance.isPresent} />
          })
            :
            students.map((s) => {
              return (
                <AssistanceRow firstName={s.student.firstName}
                  lastName={s.student.lastName} id={String(s.student.id)}
                  isPresent={false} />
              )
            })
          }
          <div className="fixed bottom-2 right-5 flex flex-row gap-5">
            <UndoButton pathName={pathName} />
            <Modal buttonText="Guardar">
              <Button type="submit">guardar</Button>
            </Modal>
          </div>
        </form>
      </section>
    </div>
  );
}
