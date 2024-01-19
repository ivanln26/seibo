import Link from "next/link";

import { getWeeklyLectures } from "../utils";
import { getUserProfile } from "@/db/queries";

type props = {
  slug: string;
  lectureID: number;
};

export default async function LecturePicker({ slug, lectureID }: props) {
  const user = await getUserProfile({ slug });

  const today = new Date();
  const lectures = await getWeeklyLectures(user.id, today);

  return (
    <section className="py-2">
      <h2 className="text-2xl">Clases</h2>
      <div className="flex gap-x-4 py-2 overflow-x-scroll">
        {lectures.map((l) => (
          <Link href={`/${slug}/lecture/${l.lecture.id}`} key={l.lecture.id}>
            <div
              className={`flex flex-col px-4 py-2 rounded text-nowrap ${
                lectureID === Number(l.lecture.id)
                  ? "bg-secondary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100"
                  : "border border-neutral-variant-50 dark:border-neutral-variant-60"
              }`}
            >
              <p className="text-xl font-bold">{l.course.name}</p>
              <p>{l.grade.name}</p>
              <p>{l.schedule.weekday}</p>
              <p>{l.schedule.startTime} - {l.schedule.endTime}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
