import { redirect } from "next/navigation";

import Form from "./form";
import { getAttendances, getLectureCourses, getStudents } from "../utils";
import LecturePicker from "./lecture-picker";
import { getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Attendance = {
  id: number | null;
  name: string;
  surname: string;
  isPresent: boolean;
  studentId: number;
  lectureId: number;
};

type Props = {
  params: {
    id: string;
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });

  const lectureID = Number(params.id);

  if (isNaN(lectureID)) {
    redirect(`/${params.slug}/lecture`);
  }

  const lectureCourse = await getLectureCourses(lectureID);

  if (lectureCourse.instance.professorId !== user.id) {
    redirect(`/${params.slug}/lecture`);
  }

  const attendances = await getAttendances(lectureID);
  const students = await getStudents(lectureID);
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
    <>
      <LecturePicker slug={params.slug} lectureID={lectureID} />
      <section className="py-2 md:w-[1080px] ">
        <h2 className="text-2xl">Alumnos</h2>
        <Form
          slug={params.slug}
          lectureID={lectureID}
          attendances={list}
          notes={lectureCourse.lecture.notes}
        />
      </section>
    </>
  );
}
