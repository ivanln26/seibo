import { redirect } from "next/navigation";

import { getUser, getWeeklyLectures } from "./utils";
import { getServerSession } from "next-auth";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
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

  function getClosestLecture() {
    let closerLecture = lectures[0].lecture.id;
    let closerDateDiff = lectures[0].lecture.date.getUTCDate() -
      today.getUTCDate();
    let closerTimeDiff =
      new Date("1970-01-01T" + lectures[0].schedule.startTime).getTime() -
      today.getTime();

    lectures.forEach((lec) => {
      const dateDiff = lec.lecture.date.getUTCDate() - today.getUTCDate();
      const timeDiff =
        new Date("1970-01-01T" + lec.schedule.startTime).getTime() -
        today.getTime();

      if (dateDiff < closerDateDiff) {
        closerLecture = lec.lecture.id;
        closerDateDiff = dateDiff;
        closerTimeDiff = timeDiff;
      } else if (dateDiff === closerDateDiff && timeDiff < closerTimeDiff) {
        closerLecture = lec.lecture.id;
        closerDateDiff = dateDiff;
        closerTimeDiff = timeDiff;
      }
    });
    redirect(`/${params.slug}/lecture/${String(closerLecture)}`);
  }

  return (
    <>
      {lectures.length === 0
        ? (
          <section className="flex flex-row justify-center items-center w-full h-full">
            <div className="text-4xl p-4 bg-primary-100 rounded shadow">
              No tenés clases para dictar.
            </div>
          </section>
        )
        : getClosestLecture()}
    </>
  );
}
