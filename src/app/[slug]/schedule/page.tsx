import { eq } from "drizzle-orm";

import Weekday from "./weekday";
import { db } from "@/db/db";
import { classroom, course, grade, instance, schedule } from "@/db/schema";
import { getUserProfile } from "@/db/queries";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const profile = await getUserProfile({ slug: params.slug });
  const actualSchool = await db.query.school.findFirst({
    where: (sc, { eq }) => eq(sc.slug, params.slug),
  });

  const userSchedules = await db.select().from(schedule)
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(classroom, eq(instance.classroomId, classroom.id))
    .where(eq(instance.professorId, profile.id))
    .orderBy(schedule.weekday, schedule.startTime);

  const allSchedules = await db.select().from(schedule)
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(classroom, eq(instance.classroomId, classroom.id))
    .where(eq(grade.schoolId, Number(actualSchool?.id)))
    .orderBy(schedule.weekday, schedule.startTime);

  if (!profile || !actualSchool) return <>Error</>;

  const schedules = profile.profiles.find((r) => r.role === "admin")
    ? allSchedules
    : userSchedules;

  const weekSchedules = {
    monday: schedules.filter((s) => s.schedule.weekday === "monday"),
    tuesday: schedules.filter((s) => s.schedule.weekday === "tuesday"),
    wednesday: schedules.filter((s) => s.schedule.weekday === "wednesday"),
    thursday: schedules.filter((s) => s.schedule.weekday === "thursday"),
    friday: schedules.filter((s) => s.schedule.weekday === "friday"),
  };

  return (
    <>
      <h1 className="text-4xl">Horarios</h1>
      <div className="flex gap-2 w-full flex-wrap lg:flex-nowrap">
        <div className="basis-full lg:basis-1/5 flex flex-col">
          <Weekday weekday="Lunes" daySchedules={weekSchedules.monday} />
        </div>
        <div className="basis-full lg:basis-1/5">
          <Weekday weekday="Martes" daySchedules={weekSchedules.tuesday} />
        </div>
        <div className="basis-full lg:basis-1/5">
          <Weekday weekday="Miercoles" daySchedules={weekSchedules.wednesday} />
        </div>
        <div className="basis-full lg:basis-1/5">
          <Weekday weekday="Jueves" daySchedules={weekSchedules.thursday} />
        </div>
        <div className="basis-full lg:basis-1/5">
          <Weekday weekday="Viernes" daySchedules={weekSchedules.friday} />
        </div>
      </div>
    </>
  );
}
