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

export const user = mysqlTable("user", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
}, (user) => ({
  emailIndex: uniqueIndex("user_email_idx").on(user.email),
}));

type SchoolSettings = {
  primaryColor: number;
};

export const userRelations = relations(user, ({ many }) => ({
  profiles: many(schoolUser),
}));

export const school = mysqlTable("school", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  settings: json("settings").$type<SchoolSettings>(),
});

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

export const schoolUserRelations = relations(schoolUser, ({ one }) => ({
  user: one(user, {
    fields: [schoolUser.userId],
    references: [user.id],
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

export const studentContact = mysqlTable("student_contact", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  type: mysqlEnum("type", ["father", "mother", "tutor", "other"]).notNull(),
});

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

export const grade = mysqlTable("grade", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("school_id").notNull(),
  name: varchar("name", { length: 32 }).notNull(),
});

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

export const courseProfessor = mysqlTable("course_professor", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("course_id").notNull(),
  professorId: int("user_id").notNull(),
}, (table) => ({
  uniqueCourseProfessor: uniqueIndex("unique_course_professor_idx").on(
    table.courseId,
    table.professorId,
  ),
}));

export const courseGrade = mysqlTable("course_grade", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("course_id").notNull(),
  gradeId: int("grade_id").notNull(),
}, (table) => ({
  uniqueCourseGrade: uniqueIndex("unique_course_grade_idx").on(
    table.courseId,
    table.gradeId,
  ),
}));

export const instance = mysqlTable("instance", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("course_id").notNull(),
  professorId: int("user_id").notNull(),
  classroomId: int("classroom_id").notNull(),
  gradeId: int("grade_id").notNull(),
});

export const schedule = mysqlTable("schedule", {
  id: int("id").autoincrement().primaryKey(),
  instanceId: int("instance_id").notNull(),
  weekday: mysqlEnum("weekday", [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export const lecture = mysqlTable("lecture", {
  id: int("id").autoincrement().primaryKey(),
  scheduleId: int("schedule_id").notNull(),
  notes: text("notes").notNull().default(""),
  date: date("date").notNull(),
});

export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  lectureId: int("lecture_id").notNull(),
  isPresent: boolean("is_present").notNull().default(true),
});

export const test = mysqlTable("test", {
  id: int("id").autoincrement().primaryKey(),
  instanceId: int("instance_id").notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  topics: text("topics").notNull(),
  date: date("date").notNull(),
});

export const score = mysqlTable("score", {
  id: int("id").autoincrement().primaryKey(),
  testId: int("test_id").notNull(),
  studentId: int("student_id").notNull(),
  score: tinyint("score").notNull(),
}, (score) => ({
  uniqueCourseGrade: uniqueIndex("unique_score_student_test_idx").on(
    score.testId,
    score.studentId,
  ),
}));

export const audit = mysqlTable("audit", {
  id: int("id").autoincrement().primaryKey(),
  table: mysqlEnum("table", ["studentGrade", "courseProfessor"]).notNull(),
  pk: int("primary_key").notNull(),
  delta: json("delta").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
