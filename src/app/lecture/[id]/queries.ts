import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import {
    attendance,
    student,
    courseGrade,
    lecture,
    schedule,
    instance,
    studentGrade,
} from "@/db/schema";

export async function getLectureCourses(lectureID: number) {
    return await db.select()
        .from(lecture)
        .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
        .innerJoin(instance, eq(schedule.instanceId, instance.id))
        .where(eq(lecture.id, lectureID))
}

export async function getAttendances(lectureID: number) {
    return await db.select()
        .from(attendance)
        .innerJoin(student, eq(attendance.studentId, student.id))
        .where(eq(attendance.lectureId, Number(lectureID)));
}

export async function getStudents(courseID: number) {
    return await db.select()
        .from(studentGrade)
        .innerJoin(courseGrade, eq(studentGrade.gradeId, courseGrade.gradeId))
        .innerJoin(student, eq(studentGrade.studentId, student.id))
        .where(eq(courseGrade.courseId, courseID))
}