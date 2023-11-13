import { db } from "@/db/db";
import { lecture, attendance, schedule, instance, grade, school, studentGrade } from "@/db/schema";
import { sql, eq, and } from "drizzle-orm";

type Data = {
    month: number;
    count: number;
};

export async function getAtendancesbyMonth(slug: string) {
    const attendances = await db.execute(sql`SELECT MONTH(lecture.date) AS month, COUNT(attendance.id) AS count FROM attendance 
        INNER JOIN lecture ON attendance.lecture_id = lecture.id
        INNER JOIN schedule ON lecture.schedule_id = schedule.id
        INNER JOIN instance ON schedule.instance_id = instance.id
        INNER JOIN grade ON instance.grade_id = grade.id
        INNER JOIN school ON grade.school_id = school.id
        WHERE attendance.is_present = 1 AND school.slug = ${slug}
        GROUP BY month`);
    return attendances[0] as unknown as Data[];
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
    const attendances = await db.execute(sql`SELECT AVG(score.score) as average FROM score
        INNER JOIN test ON score.test_id = test.id 
        INNER JOIN instance ON test.instance_id = instance.id
        INNER JOIN grade ON instance.grade_id = grade.id
        INNER JOIN school ON grade.school_id = school.id
        WHERE school.slug = ${slug}`);
    return attendances[0] as unknown as [{average: string}];
}

export async function getExamsAveragePerSubject(slug: string) {
    const attendances = await db.execute(sql`SELECT course.name as subject, AVG(score.score) as average FROM score
        INNER JOIN test ON score.test_id = test.id 
        INNER JOIN instance ON test.instance_id = instance.id
        INNER JOIN course ON instance.course_id = course.id
        INNER JOIN school ON course.school_id = school.id
        WHERE school.slug = ${slug}
        GROUP BY subject`);
    return attendances[0] as unknown as [{subject: string, average: number}];
}