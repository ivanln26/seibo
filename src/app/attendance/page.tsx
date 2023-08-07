import { redirect } from 'next/navigation'

import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import {
    lecture,
    grade,
    course,
    schedule,
    instance
} from "@/db/schema";

export default async function Page() {
    const today = new Date()

    const lectures = await db.select().from(lecture)
        .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
        .innerJoin(instance, eq(schedule.instanceId, instance.id))
        .innerJoin(course, eq(instance.courseId, course.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .where(eq(instance.professorId, 1))

    let closerLecture = lectures[0].lecture.id
    let closerDateDiff = lectures[0].lecture.date.getUTCDate() - today.getUTCDate();
    let closerTimeDiff = new Date("1970-01-01T" + lectures[0].schedule.startTime).getTime() - today.getTime();

    lectures.forEach((lec) => {
        let dateDiff = lec.lecture.date.getUTCDate() - today.getUTCDate()
        let timeDiff = new Date("1970-01-01T" + lec.schedule.startTime).getTime() - today.getTime()

        if (dateDiff < closerDateDiff){
            closerLecture = lec.lecture.id;
            closerDateDiff = dateDiff
            closerTimeDiff = timeDiff
        }else if (dateDiff === closerDateDiff && timeDiff < closerTimeDiff){
                closerLecture = lec.lecture.id;
                closerDateDiff = dateDiff
                closerTimeDiff = timeDiff
        }
    })
    redirect(`/attendance/${String(closerLecture)}`)
    
}