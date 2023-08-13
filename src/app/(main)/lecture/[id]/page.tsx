import { headers } from "next/headers";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import Modal from "@/components/modal";
import { updateAssistances } from "./update-assistances";
import { getAttendances, getLectureCourses, getStudents } from "./queries";
import AssistanceRow from "./assistance-row";
import LecturePicker from "./lecture-picker";
import UndoButton from "./undo-button";

export default async function Page() {
  const pathName = headers().get("x-invoke-path") || "";
  const lectureID = Number(pathName.split("/").pop());
  const today = new Date();
  const monthName = format(today, "MMMM", { locale: es });

  const lectureCourse = await getLectureCourses(lectureID);
  const attendances = await getAttendances(lectureID);
  const students = await getStudents(lectureCourse[0].instance.courseId);

  // TODO: Añadir logica en caso de que añada un NUEVO alumno
  // al curso y la lista ya este creada.
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
          <input
            type="hidden"
            name="listIsCreated"
            value={Number(listIsCreated)}
          />
          {listIsCreated
            ? attendances.map((a) => {
              return (
                <AssistanceRow
                  firstName={a.student.firstName}
                  lastName={a.student.lastName}
                  id={String(a.attendance.id)}
                  isPresent={a.attendance.isPresent}
                />
              );
            })
            : students.map((s) => {
              return (
                <AssistanceRow
                  firstName={s.student.firstName}
                  lastName={s.student.lastName}
                  id={String(s.student.id)}
                  isPresent={false}
                />
              );
            })}
          <div className="fixed bottom-2 right-5 flex flex-row gap-5">
            <UndoButton pathName={pathName} />
            <Modal
              buttonText="Guardar"
              confirmButton={{ text: "guardar", type: "submit" }}
            >
              <h1 className="text-2xl">
                ¿Segur@ que desea guardar los cambios?
              </h1>
            </Modal>
          </div>
        </form>
      </section>
    </div>
  );
}
