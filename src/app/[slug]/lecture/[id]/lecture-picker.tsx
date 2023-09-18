import Link from "next/link";
import { getServerSession } from "next-auth";

import { getUser, getWeeklyLectures } from "../utils";

type props = {
  slug: string;
  lectureID: number;
};

export default async function LecturePicker({ slug, lectureID }: props) {
  const session = await getServerSession();

  if (!session) {
    return <>Error al obtener la sesión.</>;
  }
  const user = await getUser(session);

  if (!user) {
    return <>Error al obtener el usuario de la base de datos.</>;
  }
  const today = new Date();
  const lectures = await getWeeklyLectures(user.id, today);
  return lectures.map((l) => {
    return (
      <Link href={`${slug}/lecture/${l.lecture.id}`}>
        <div
          className={`p-5 px-6 m-2 border rounded-xl w-max flex flex-col font-bold ${
            lectureID === Number(l.lecture.id) ? "bg-secondary-100" : ""
          }`}
        >
          <p>{l.course.name}</p>
          <p>{l.grade.name}</p>
          <p>{l.schedule.weekday}</p>
          <p>{l.schedule.startTime} - {l.schedule.endTime}</p>
        </div>
      </Link>
    );
  });
}
