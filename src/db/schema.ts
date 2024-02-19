import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  time,
  timestamp,
  tinyint,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import type { TwColor } from "@/color";

export const user = mysqlTable("user", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
}, (user) => ({
  emailIndex: uniqueIndex("user_email_idx").on(user.email),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const userRelations = relations(user, ({ many }) => ({
  gradeTutors: many(gradeTutor),
  profiles: many(schoolUser),
  instances: many(instance),
}));

export type SchoolSettings = {
  color: {
    primary: TwColor;
    secondary: TwColor;
  };
  terms: {
    first: { start: string; end: string };
    second: { start: string; end: string };
    third: { start: string; end: string };
  };
};

export const school = mysqlTable("school", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 20 }).notNull(),
  settings: json("settings").$type<SchoolSettings>(),
});

export type School = typeof school.$inferSelect;
export type NewSchool = typeof school.$inferInsert;

export const schoolRelations = relations(school, ({ many }) => ({
  classrooms: many(classroom),
  courses: many(course),
  grades: many(grade),
  profiles: many(schoolUser),
  students: many(student),
}));

export type Role = "teacher" | "tutor" | "principal" | "admin";

export const schoolUser = mysqlTable("school_user", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("school_id").notNull(),
  userId: int("user_id").notNull(),
  role: mysqlEnum("role", ["teacher", "tutor", "principal", "admin"]).notNull(),
  isActive: boolean("is_active").notNull().default(false),
}, (table) => ({
  uniqueSchoolUserRole: uniqueIndex("unique_school_user_role_idx").on(
    table.schoolId,
    table.userId,
    table.role,
  ),
}));

export type SchoolUser = typeof schoolUser.$inferSelect;
export type NewSchoolUser = typeof schoolUser.$inferInsert;

export const schoolUserRelations = relations(schoolUser, ({ one }) => ({
  user: one(user, {
    fields: [schoolUser.userId],
    references: [user.id],
  }),
  school: one(school, {
    fields: [schoolUser.schoolId],
    references: [school.id],
  }),
}));

export const student = mysqlTable("student", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("school_id").notNull(),
  studentCode: varchar("student_code", { length: 32 }).notNull(),
  firstName: varchar("first_name", { length: 128 }).notNull(),
  lastName: varchar("last_name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
}, (student) => ({
  uniqueStudentId: uniqueIndex("unique_student_id_idx").on(
    student.schoolId,
    student.studentCode,
  ),
}));

export type Student = typeof student.$inferSelect;
export type NewStudent = typeof student.$inferInsert;

export const studentRelations = relations(student, ({ many, one }) => ({
  attendances: many(attendance),
  contacts: many(studentContact),
  scores: many(score),
  school: one(school, {
    fields: [student.schoolId],
    references: [school.id],
  }),
  studentGrades: many(studentGrade),
}));

export const studentContact = mysqlTable("student_contact", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  type: mysqlEnum("type", ["father", "mother", "tutor", "other"]).notNull(),
});

export type StudentContact = typeof studentContact.$inferSelect;
export type NewStudentContact = typeof studentContact.$inferInsert;

export const studentContactRelations = relations(studentContact, ({ one }) => ({
  student: one(student, {
    fields: [studentContact.studentId],
    references: [student.id],
  }),
}));

export const classroom = mysqlTable("classroom", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("school_id").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
}, (classroom) => ({
  uniqueClassroom: uniqueIndex("unique_classroom_name_idx").on(
    classroom.schoolId,
    classroom.name,
  ),
}));

export type Classroom = typeof classroom.$inferSelect;
export type NewClassroom = typeof classroom.$inferInsert;

export const classroomRelations = relations(classroom, ({ many, one }) => ({
  instances: many(instance),
  school: one(school, {
    fields: [classroom.schoolId],
    references: [school.id],
  }),
}));

export const grade = mysqlTable("grade", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("school_id").notNull(),
  name: varchar("name", { length: 32 }).notNull(),
});

export type Grade = typeof grade.$inferSelect;
export type NewGrade = typeof grade.$inferInsert;

export const gradeRelations = relations(grade, ({ many, one }) => ({
  gradeTutors: many(gradeTutor),
  instances: many(instance),
  school: one(school, {
    fields: [grade.schoolId],
    references: [school.id],
  }),
  studentGrades: many(studentGrade),
}));

export const studentGrade = mysqlTable("student_grade", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  gradeId: int("grade_id").notNull(),
}, (table) => ({
  uniqueStudentGrade: uniqueIndex("unique_student_grade_idx").on(
    table.studentId,
    table.gradeId,
  ),
}));

export type StudentGrade = typeof studentGrade.$inferSelect;
export type NewStudentGrade = typeof studentGrade.$inferInsert;

export const studentGradeRelations = relations(studentGrade, ({ one }) => ({
  grade: one(grade, {
    fields: [studentGrade.gradeId],
    references: [grade.id],
  }),
  student: one(student, {
    fields: [studentGrade.studentId],
    references: [student.id],
  }),
}));

export const course = mysqlTable("course", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("school_id").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  topics: text("topics").notNull(),
}, (course) => ({
  uniqueName: uniqueIndex("unique_course_name_idx").on(
    course.schoolId,
    course.name,
  ),
}));

export type Course = typeof course.$inferSelect;
export type NewCourse = typeof course.$inferInsert;

export const courseRelations = relations(course, ({ many, one }) => ({
  instances: many(instance),
  school: one(school, {
    fields: [course.schoolId],
    references: [school.id],
  }),
}));

export const instance = mysqlTable("instance", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("course_id").notNull(),
  professorId: int("user_id").notNull(),
  classroomId: int("classroom_id").notNull(),
  gradeId: int("grade_id").notNull(),
});

export type Instance = typeof instance.$inferSelect;
export type NewInstance = typeof instance.$inferInsert;

export const instanceRelations = relations(instance, ({ many, one }) => ({
  classroom: one(classroom, {
    fields: [instance.classroomId],
    references: [classroom.id],
  }),
  course: one(course, {
    fields: [instance.courseId],
    references: [course.id],
  }),
  grade: one(grade, {
    fields: [instance.gradeId],
    references: [grade.id],
  }),
  schedules: many(schedule),
  tests: many(test),
  user: one(user, {
    fields: [instance.professorId],
    references: [user.id],
  }),
}));

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export type Weekday = typeof weekdays[number];

export const weekdayTranslate: Record<Weekday, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
} as const;

export const schedule = mysqlTable("schedule", {
  id: int("id").autoincrement().primaryKey(),
  instanceId: int("instance_id").notNull(),
  weekday: mysqlEnum("weekday", weekdays).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export type Schedule = typeof schedule.$inferSelect;
export type NewSchedule = typeof schedule.$inferInsert;

export const scheduleRelations = relations(schedule, ({ many, one }) => ({
  instance: one(instance, {
    fields: [schedule.instanceId],
    references: [instance.id],
  }),
  lectures: many(lecture),
}));

export const lecture = mysqlTable("lecture", {
  id: int("id").autoincrement().primaryKey(),
  scheduleId: int("schedule_id").notNull(),
  notes: text("notes").notNull().default(""),
  date: date("date").notNull(),
});

export type Lecture = typeof lecture.$inferSelect;
export type NewLecture = typeof lecture.$inferInsert;

export const lectureRelations = relations(lecture, ({ many, one }) => ({
  attendances: many(attendance),
  schedule: one(schedule, {
    fields: [lecture.scheduleId],
    references: [schedule.id],
  }),
}));

export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  lectureId: int("lecture_id").notNull(),
  isPresent: boolean("is_present").notNull().default(true),
});

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;

export const attendanceRelations = relations(attendance, ({ one }) => ({
  lecture: one(lecture, {
    fields: [attendance.lectureId],
    references: [lecture.id],
  }),
  student: one(student, {
    fields: [attendance.studentId],
    references: [student.id],
  }),
}));

export const test = mysqlTable("test", {
  id: int("id").autoincrement().primaryKey(),
  instanceId: int("instance_id").notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  topics: text("topics").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
});

export type Test = typeof test.$inferSelect;
export type NewTest = typeof test.$inferInsert;

export const testRelations = relations(test, ({ many, one }) => ({
  instance: one(instance, {
    fields: [test.instanceId],
    references: [instance.id],
  }),
  scores: many(score),
}));

export const score = mysqlTable("score", {
  id: int("id").autoincrement().primaryKey(),
  testId: int("test_id").notNull(),
  studentId: int("student_id").notNull(),
  score: tinyint("score").notNull(),
}, (score) => ({
  uniqueScoreStudent: uniqueIndex("unique_score_student_test_idx").on(
    score.testId,
    score.studentId,
  ),
}));

export type Score = typeof score.$inferSelect;
export type NewScore = typeof score.$inferInsert;

export const scoreRelations = relations(score, ({ one }) => ({
  student: one(student, {
    fields: [score.studentId],
    references: [student.id],
  }),
  test: one(test, {
    fields: [score.testId],
    references: [test.id],
  }),
}));

export const gradeTutor = mysqlTable("grade_tutor", {
  id: int("id").autoincrement().primaryKey(),
  gradeId: int("grade_id").notNull(),
  tutorId: int("user_id").notNull(),
}, (table) => ({
  uniqueGradeTutor: uniqueIndex("unique_grade_tutor_idx").on(
    table.gradeId,
    table.tutorId,
  ),
}));

export const gradeTutorRelations = relations(gradeTutor, ({ one }) => ({
  grade: one(grade, {
    fields: [gradeTutor.gradeId],
    references: [grade.id],
  }),
  tutor: one(user, {
    fields: [gradeTutor.tutorId],
    references: [user.id],
  }),
}));

export const audit = mysqlTable("audit", {
  id: int("id").autoincrement().primaryKey(),
  table: mysqlEnum("table", ["studentGrade"]).notNull(),
  pk: int("primary_key").notNull(),
  delta: json("delta").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Audit = typeof audit.$inferSelect;
export type NewAudit = typeof audit.$inferInsert;
