import { db } from "@/db/db"
import { getUserProfile } from "@/db/queries"
import { classroom, course, grade, instance, schedule } from "@/db/schema"
import { eq } from "drizzle-orm"

type Props = {
    params: {
        slug: string
    }
}

export default async function Page({ params }: Props) {
    const profile = await getUserProfile({ slug: params.slug })
    const actualSchool = await db.query.school.findFirst({
        where: (sc, { eq }) => eq(sc.slug, params.slug)
    })
    const schedules = await db.select().from(schedule)
        .innerJoin(instance, eq(schedule.instanceId, instance.id))
        .innerJoin(course, eq(instance.courseId, course.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .innerJoin(classroom, eq(instance.classroomId, classroom.id))
        .where(eq(instance.professorId, profile.id))
        .orderBy(schedule.weekday, schedule.startTime)

    console.log(schedules)
    if (!profile || !actualSchool) return <>Error</>

    const weekSchedules = {
        monday: schedules.filter((s) => s.schedule.weekday === "monday"),
        tuesday: schedules.filter((s) => s.schedule.weekday === "tuesday"),
        wednesday: schedules.filter((s) => s.schedule.weekday === "wednesday"),
        thursday: schedules.filter((s) => s.schedule.weekday === "thursday"),
        friday: schedules.filter((s) => s.schedule.weekday === "friday")
    }

    return (
        <>
            <h1 className="text-4xl">Horarios</h1>
            <div className="flex gap-2 w-full flex-wrap lg:flex-nowrap">
                <div className="basis-full lg:basis-1/5 flex flex-col">
                    <h2 className="text-2xl">Lunes</h2>
                    {weekSchedules.monday.map((s) => (
                        <div className=" bg-primary-100 rounded-xl outline outline-1 outline-outline flex flex-col p-2 m-2">
                            <p className="font-bold text-xl">{s.course.name}</p>
                            <p>{s.grade.name} | {s.classroom.name}</p>
                            <p>{s.schedule.startTime} - {s.schedule.endTime}</p>
                        </div>
                    ))}
                </div>
                <div className="basis-full lg:basis-1/5">
                    <h2 className="text-2xl">Martes</h2>
                    {weekSchedules.tuesday.map((s) => (
                        <div className=" bg-primary-100 rounded-xl outline outline-1 outline-outline flex flex-col p-2 m-2">
                            <p className="font-bold text-xl">{s.course.name}</p>
                            <p>{s.grade.name} | {s.classroom.name}</p>
                            <p>{s.schedule.startTime} - {s.schedule.endTime}</p>
                        </div>
                    ))}
                </div>
                <div className="basis-full lg:basis-1/5">
                    <h2 className="text-2xl">Miercoles</h2>
                    {weekSchedules.wednesday.map((s) => (
                        <div className=" bg-primary-100 rounded-xl outline outline-1 outline-outline flex flex-col p-2 m-2">
                            <p className="font-bold text-xl">{s.course.name}</p>
                            <p>{s.grade.name} | {s.classroom.name}</p>
                            <p>{s.schedule.startTime} - {s.schedule.endTime}</p>
                        </div>
                    ))}
                </div>
                <div className="basis-full lg:basis-1/5">
                    <h2 className="text-2xl">Jueves</h2>
                    {weekSchedules.thursday.map((s) => (
                        <div className=" bg-primary-100 rounded-xl outline outline-1 outline-outline flex flex-col p-2 m-2">
                            <p className="font-bold text-xl">{s.course.name}</p>
                            <p>{s.grade.name} | {s.classroom.name}</p>
                            <p>{s.schedule.startTime} - {s.schedule.endTime}</p>
                        </div>
                    ))}
                </div>
                <div className="basis-full lg:basis-1/5">
                    <h2 className="text-2xl">Viernes</h2>
                    {weekSchedules.friday.map((s) => (
                        <div className=" bg-primary-100 rounded-xl outline outline-1 outline-outline flex flex-col p-2 m-2">
                            <p className="font-bold text-xl">{s.course.name}</p>
                            <p>{s.grade.name} | {s.classroom.name}</p>
                            <p>{s.schedule.startTime} - {s.schedule.endTime}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}