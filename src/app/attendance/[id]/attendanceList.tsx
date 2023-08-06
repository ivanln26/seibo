import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import {
    attendance,
    lecture,
    student,
} from "@/db/schema";

import Switch from "@/components/switch"

export default async function AttendanceList({lectureID}: {lectureID: number}) {
    const lectures = await db.select()
    .from(attendance)
    .innerJoin(lecture, eq(attendance.lectureId, lecture.id))
    .innerJoin(student, eq(attendance.studentId, student.id))
    .where(eq(lecture.id, Number(lectureID)));
    return (
        <>
            {lectures.map((a) => {
                return (
                    <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
                        <p className="text-xl">{a.student.lastName}, {a.student.firstName}</p>
                        <Switch id="test1" name="test1" />
                    </div>
                )
            })}
        </>
    )
}