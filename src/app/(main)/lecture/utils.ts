import { and, between, eq } from "drizzle-orm";

import { db } from "@/db/db";
import {
  attendance,
  course,
  courseGrade,
  grade,
  instance,
  lecture,
  schedule,
  student,
  studentGrade,
} from "@/db/schema";
import { Session } from "next-auth";

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
    .where(eq(attendance.lectureId, Number(lectureID)));
}

export async function getStudents(courseID: number) {
  return await db.select()
    .from(studentGrade)
    .innerJoin(courseGrade, eq(studentGrade.gradeId, courseGrade.gradeId))
    .innerJoin(student, eq(studentGrade.studentId, student.id))
    .where(eq(courseGrade.courseId, courseID));
}

export async function getUser(session: Session) {
  return await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, session.user.email),
    with: {
      profiles: { where: (profile, { eq }) => eq(profile.isActive, true) },
    },
  });
}

export function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  const newDate = new Date(d.setDate(diff));
  return new Date(newDate.setUTCHours(0, 0, 0, 0));
}

export function getFriday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day <= 5 ? (5 - day) : (12 - day)); // adjust when day is after Friday
  const newDate = new Date(d.setDate(diff));
  return new Date(newDate.setUTCHours(23, 59, 59));
}

export async function getWeeklyLectures(professorId: number, date: Date) {
  return await db.select().from(lecture)
    .innerJoin(schedule, eq(lecture.scheduleId, schedule.id))
    .innerJoin(instance, eq(schedule.instanceId, instance.id))
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .where(and(
      eq(instance.professorId, 1),
      between(lecture.date, getMonday(date), getFriday(date)),
    ))
    .orderBy(schedule.weekday, schedule.startTime);
}
