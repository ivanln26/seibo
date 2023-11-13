import { and, eq, sql } from "drizzle-orm";

import Canvas from "./charts/canvas";
import Attendances from "./charts/attendances";
import AttendancesByMonth from "./charts/attendancesbyMonth";
import { getAtendancesbyMonth, getAttendancesByCourse, getExamsAveragePerSubject, getNonAttendancesByCourse, getSchoolAverage, getStudentsByGrade } from "./queries";
import AvgScoresByCourse from "./charts/avgScoresByCourse";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const studentsByGrade = await getStudentsByGrade(params.slug)

  const attendances = await getAttendancesByCourse(params.slug)

  const notAttendances = await getNonAttendancesByCourse(params.slug)
  const all = attendances.concat(notAttendances).sort((a, b) => a.gradeId - b.gradeId)

  const attendancesByMonth = await getAtendancesbyMonth(params.slug)

  const schoolAverage = (await getSchoolAverage(params.slug))[0].average;

  const examsAveragePerSubject = await getExamsAveragePerSubject(params.slug);
  console.log(examsAveragePerSubject)

  return (
    <>
      <div className="grid grid-cols-4 gap-12">
        <div className="col-span-4 lg:col-span-1 flex flex-col justify-center items-center p-2 outline outline-1 outline-outline rounded-xl">
          <h1 className="text-center text-xl">Cantidad de alumnos por curso</h1>
          <Canvas data={studentsByGrade} />
        </div>
        <div className="col-span-4 lg:col-span-2 flex flex-col justify-center items-center p-2 outline outline-1 outline-outline rounded-xl ">
          <h1 className="text-center text-xl">Cantidad de asistencias por mes</h1>
          <AttendancesByMonth data={attendancesByMonth} />
        </div>
        <div className="col-span-4 lg:col-span-1 flex flex-col justify-center items-center p-2 outline outline-1 outline-outline rounded-xl">
          <h1 className="text-center text-xl">Promedio total de resultados de examenes</h1>
          <h1 className="text-center text-8xl">{Number(schoolAverage).toPrecision(3)}</h1>
        </div>
        <div className="col-span-4 lg:col-span-2 flex flex-col justify-center items-center p-2 outline outline-1 outline-outline rounded-xl">
          <h1 className="text-center text-xl">Cantidad de asistencias / inasistencias por curso</h1>
          <Attendances data={all} />
        </div>
        <div className="col-span-4 lg:col-span-2 flex flex-col justify-center items-center p-2 outline outline-1 outline-outline rounded-xl">
          <h1 className="text-center text-xl">Cantidad de asistencias / inasistencias por curso</h1>
          <AvgScoresByCourse data={examsAveragePerSubject} />
        </div>
      </div>
    </>
  );
}
