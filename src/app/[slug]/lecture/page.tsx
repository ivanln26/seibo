import { redirect } from "next/navigation";

import { getWeeklyLectures } from "./utils";
import { getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });

  const today = new Date();
  const lectures = await getWeeklyLectures(user.id, today);

  function getClosestLecture() {
    let closerLecture = lectures[0].lecture.id;

    const newDate = new Date(lectures[0].lecture.date)
    newDate.setHours(Number(lectures[0].schedule.startTime.substring(0, 1)))
    newDate.setMinutes(Number(lectures[0].schedule.startTime.substring(3, 4)))

    let closerDiff = Math.abs(
      newDate.getTime() -
      today.getTime()
    )

    lectures.forEach((lec) => {
      const newDate = new Date(lec.lecture.date)
      newDate.setHours(Number(lec.schedule.startTime.substring(0, 1)))
      newDate.setMinutes(Number(lec.schedule.startTime.substring(3, 4)))
      const diff = Math.abs(
       newDate.getTime() -
        today.getTime()
      )
      if (diff < closerDiff) {
        closerLecture = lec.lecture.id;
        closerDiff = diff;
      }
    });
    
    redirect(`/${params.slug}/lecture/${String(closerLecture)}`);
  }

  return (
    <>
      {lectures.length === 0
        ? (
          <p className="py-2 text-2xl text-primary-600 dark:text-primary-200">
            No tenés clases para dictar.
          </p>
        )
        : getClosestLecture()}
    </>
  );
}
