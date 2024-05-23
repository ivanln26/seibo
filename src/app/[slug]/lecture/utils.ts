import { and, between, eq } from "drizzle-orm";

import { db } from "@/db/db";
import {
  attendance,
  course,
  grade,
  instance,
  lecture,
  schedule,
  student,
  studentGrade,
} from "@/db/schema";

export async function getLectureCourses(lectureID: number) {
  const aux = await db.select()
    .from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .where(eq(lecture.id, lectureID));

  return aux[0];
}

export async function getAttendances(lectureID: number) {
  return await db.select()
    .from(attendance)
    .innerJoin(student, eq(attendance.studentId, student.id))
    .where(eq(attendance.lectureId, Number(lectureID)))
    .orderBy(student.lastName);
}

export async function getStudents(lectureID: number) {
  return await db.select()
    .from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(studentGrade, eq(grade.id, studentGrade.gradeId))
    .innerJoin(student, eq(studentGrade.studentId, student.id))
    .where(eq(lecture.id, lectureID)).orderBy(student.lastName);
}

export function getMonday(d: Date) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  const newDate = new Date(d.setDate(diff));
  return new Date(newDate.setUTCHours(0, 0, 0, 0));
}

export function getFriday(d: Date) {
  d = new Date(d);
  const day = d.getDay();
  const daysUntilFriday = day <= 5 ? 5 - day : 5 + (7 - day);
  d.setDate(d.getDate() + daysUntilFriday);

  // Ajustamos la hora a las 23:59:59
  d.setHours(23, 59, 59);

  return d;
}

export async function getWeeklyLectures(professorId: number, date: Date) {
  return await db.select().from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(and(
      eq(instance.professorId, professorId),
      between(lecture.date, getMonday(date), getFriday(date)),
    ))
    .orderBy(schedule.weekday, schedule.startTime);
}
