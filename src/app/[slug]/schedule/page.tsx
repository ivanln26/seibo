import { eq } from "drizzle-orm";

import Weekday from "./weekday";
import { db } from "@/db/db";
import { classroom, course, grade, instance, schedule } from "@/db/schema";
import { getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const profile = await getUserProfile({ slug: params.slug });
  const isAdmin = profile.profiles.find((r) => r.role === "admin");

  const actualSchool = await db.query.school.findFirst({
    where: (sc, { eq }) => eq(sc.slug, params.slug),
  });

  const schedules = await db.select().from(schedule)
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(classroom, eq(instance.classroomId, classroom.id))
    .where(
      isAdmin
        ? eq(grade.schoolId, Number(actualSchool?.id))
        : eq(instance.professorId, profile.id),
    )
    .orderBy(schedule.startTime, schedule.endTime);

  const weekdays = [
    {
      name: "Lunes",
      query: schedules.filter((s) => s.schedule.weekday === "monday"),
    },
    {
      name: "Martes",
      query: schedules.filter((s) => s.schedule.weekday === "tuesday"),
    },
    {
      name: "Miércoles",
      query: schedules.filter((s) => s.schedule.weekday === "wednesday"),
    },
    {
      name: "Jueves",
      query: schedules.filter((s) => s.schedule.weekday === "thursday"),
    },
    {
      name: "Viernes",
      query: schedules.filter((s) => s.schedule.weekday === "friday"),
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold">Horarios</h1>
      <div className="flex flex-wrap gap-2 w-full lg:flex-nowrap">
        {weekdays.map((weekday, i) => (
          <div className="flex flex-col gap-2 basis-full lg:basis-1/5" key={i}>
            <Weekday weekday={weekday.name} daySchedules={weekday.query} />
          </div>
        ))}
      </div>
    </>
  );
}
