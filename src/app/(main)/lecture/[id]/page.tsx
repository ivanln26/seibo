import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import Modal from "@/components/modal";
import { updateAssistances } from "./update-assistances";
import { getAttendances, getLectureCourses, getStudents } from "../utils";
import AssistanceRow from "./assistance-row";
import LecturePicker from "./lecture-picker";
import UndoButton from "./undo-button";

type Props = {
  params: {
    id: string;
  };
};

type Attendance = {
  id: number | null;
  name: string;
  surname: string;
  isPresent: boolean;
  studentId: number;
  lectureId: number;
};

export const revalidate = 0;

export default async function Page({ params }: Props) {
  const lectureID = Number(params.id);

  if (Number.isNaN(lectureID)) {
    redirect("/");
  }

  const today = new Date();
  const monthName = format(today, "MMMM", { locale: es });

  const lectureCourse = await getLectureCourses(lectureID);

  if (lectureCourse.instance.professorId !== 1) {
    throw new Error("Profesor no valido");
  }

  const attendances = await getAttendances(lectureID);
  const students = await getStudents(lectureCourse.instance.courseId);

  const attendanceStudentsIds = attendances.map((a) => a.attendance.studentId);
  const list: Attendance[] = [];

  students.forEach((s) => {
    if (attendanceStudentsIds.includes(s.student.id)) {
      const att = attendances[attendanceStudentsIds.indexOf(s.student.id)];
      list.push({
        id: att.attendance.id,
        name: att.student.firstName,
        surname: att.student.lastName,
        isPresent: att.attendance.isPresent,
        lectureId: att.attendance.lectureId,
        studentId: att.attendance.studentId,
      });
    } else {
      list.push({
        id: null,
        name: s.student.firstName,
        surname: s.student.lastName,
        isPresent: false,
        lectureId: lectureID,
        studentId: s.student.id,
      });
    }
  });

  return (
    <div className="flex flex-col gap-5 h-screen mx-2">
      <h1 className="text-4xl">
        Asistencias - {today.getDate()} de {monthName} de {today.getFullYear()}
      </h1>
      <h2 className="text-2xl">Clases</h2>
      <section className="flex flex-row gap-5 overflow-x-auto w-screen md:w-max text-center">
        <LecturePicker lectureID={Number(lectureID)} />
      </section>
      <section className="flex px-4 flex-col gap-2 mt-2 w-screen md:w-[1080px] ">
        <form action={updateAssistances}>
          <input type="hidden" name="lectureID" value={lectureID} />
          {list.map((l) => {
            return (
              <AssistanceRow
                firstName={l.name}
                lastName={l.surname}
                id={String(l.id)}
                isPresent={l.isPresent}
                studentId={l.studentId}
              />
            );
          })}

          <div className="flex flex-col h-full">
            <label htmlFor="notes" className="mt-5 text-2xl mb-4">Notas</label>
            <textarea
              defaultValue={lectureCourse.lecture.notes}
              name="notes"
              id="notes"
              className="w-full border border-grey rounded pb-5 resize-y"
            />
          </div>
          <div className="fixed bottom-2 right-5 flex flex-row gap-5">
            <UndoButton lectureID={lectureID} />
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
