import { headers } from "next/headers";

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import AttendanceList from "./attendanceList"
import LecturePicker from "./lecturePicker"
import Button from "@/components/button";
import Modal from "@/components/modal";

export default async function Page() {
  const pathName = headers().get("x-invoke-path") || "";
  const lectureID = pathName.split("").pop()
  const today = new Date();
  const monthName = format(today, 'MMMM', { locale: es });



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
        <AttendanceList lectureID={Number(lectureID)} />
      </section>
      <div className="fixed bottom-2 right-5 flex flex-row gap-5">
        <Button color="error" kind="tonal">Deshacer</Button>
        <Modal buttonText="Guardar">Item guardado con exito</Modal>
      </div>
    </div>
  );
}
