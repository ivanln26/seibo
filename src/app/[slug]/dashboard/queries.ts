import { db } from "@/db/db";
import { lecture, attendance, schedule, instance, grade, school, studentGrade, score, test, course } from "@/db/schema";
import { sql, eq, and } from "drizzle-orm";

export async function getAtendancesbyMonth(slug: string) {
    return await db.select({
        month: sql<number>`MONTH(${lecture.date})`,
        count: sql<number>`COUNT(attendance.id)`
    }).from(attendance)
        .innerJoin(lecture, eq(attendance.lectureId, lecture.id))
        .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
        .innerJoin(instance, eq(schedule.instanceId, instance.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .innerJoin(school, eq(grade.schoolId, school.id))
        .where(and(eq(attendance.isPresent, true), eq(school.slug, slug)))
        .groupBy(sql<number>`MONTH(${lecture.date})`);
}

export async function getAttendancesByCourse(slug: string) {
    return await db.select({
        gradeId: grade.id,
        grade: grade.name,
        isPresent: attendance.isPresent,
        count: sql<number>`count(${attendance.id})`,
    }).from(attendance)
        .innerJoin(lecture, eq(attendance.lectureId, lecture.id))
        .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
        .innerJoin(instance, eq(schedule.instanceId, instance.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .innerJoin(school, eq(grade.schoolId, school.id))
        .where(and(eq(attendance.isPresent, true), eq(school.slug, slug)))
        .groupBy(grade.id);
}

export async function getNonAttendancesByCourse(slug: string) {
    return await db.select({
        gradeId: grade.id,
        grade: grade.name,
        isPresent: attendance.isPresent,
        count: sql<number>`count(${attendance.id})`,
    }).from(attendance)
        .innerJoin(lecture, eq(attendance.lectureId, lecture.id))
        .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
        .innerJoin(instance, eq(schedule.instanceId, instance.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .innerJoin(school, eq(grade.schoolId, school.id))
        .where(and(eq(attendance.isPresent, false), eq(school.slug, slug)))
        .groupBy(grade.id);
}

export async function getStudentsByGrade(slug: string) {
    return await db
        .select({
            gradeId: grade.id,
            grade: grade.name,
            count: sql<number>`count(${studentGrade.studentId})`,
        })
        .from(studentGrade)
        .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
        .innerJoin(school, eq(grade.schoolId, school.id))
        .where(eq(school.slug, slug))
        .groupBy(({ gradeId }) => gradeId);
}

export async function getSchoolAverage(slug: string) {
    return await db.select({
        average: sql<number>`AVG(${score.score})`
    }).from(score)
        .innerJoin(test, eq(score.testId, test.id))
        .innerJoin(instance, eq(test.instanceId, instance.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .innerJoin(school, eq(grade.schoolId, school.id))
        .where(eq(school.slug, slug))
}

export async function getExamsAveragePerSubject(slug: string) {
    return await db.select({
        subject: course.name,
        average: sql<number>`AVG(${score.score})`
    }).from(score)
        .innerJoin(test, eq(score.testId, test.id))
        .innerJoin(instance, eq(test.instanceId, instance.id))
        .innerJoin(course, eq(instance.courseId, course.id))
        .innerJoin(school, eq(course.schoolId, school.id))
        .where(eq(school.slug, slug))
        .groupBy(course.id)
}