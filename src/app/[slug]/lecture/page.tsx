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
          <p className="py-2 text-2xl text-primary-600 dark:text-primary-200">
            No tenés clases para dictar.
          </p>
        )
        : getClosestLecture()}
    </>
  );
}
