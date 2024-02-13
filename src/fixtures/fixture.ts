import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { z } from "zod";

import {
  attendance,
  classroom,
  course,
  grade,
  instance,
  lecture,
  schedule,
  school,
  score,
  student,
  test,
  user,
} from "@/db/schema";
import type { NewSchedule, NewSchool } from "@/db/schema";

const envSchema = z.object({
  databaseURL: z.string(),
});

const { parsed } = dotenvExpand.expand(dotenv.config());

const env = envSchema.parse({
  databaseURL: parsed?.DATABASE_URL,
});

const poolConnection = mysql.createPool(env.databaseURL);
const db = drizzle(poolConnection);

const schools: NewSchool[] = [
  {
    name: "ITS Villada",
    slug: "itsv",
    settings: null,
  },
  {
    name: "La Salle",
    slug: "la-salle",
    settings: null,
  },
];

const users = [
  {
    email: "mateocetti2000@gmail.com",
    name: "Cetti Mateo",
  },
  {
    email: "ramiroghilino@gmail.com",
    name: "Ghilino Ramiro",
  },
  {
    email: "manuelbobadilla@gmail.com",
    name: "Bobadilla Manuel",
  },
  {
    email: "ivannunez@gmail.com",
    name: "Nuñez Ivan",
  },
  {
    email: "juanvillareal@gmail.com",
    name: "Villareal Juan",
  },
];

const students = [
  {
    email: "mateocetti2000@gmail.com",
    firstName: "Mateo",
    lastName: "Cetti",
    schoolId: 1,
    studentCode: "AF2001",
  },
  {
    email: "ramiroghilino@gmail.com",
    firstName: "Ramiro",
    lastName: "Ghilino",
    schoolId: 1,
    studentCode: "AF2002",
  },
  {
    email: "manuelbobadilla@gmail.com",
    firstName: "Manuel",
    lastName: "Bobadilla",
    schoolId: 1,
    studentCode: "AF2003",
  },
  {
    email: "ivannunez@gmail.com",
    firstName: "Ivan",
    lastName: "Nuñez",
    schoolId: 1,
    studentCode: "AF2004",
  },
  {
    email: "juanvillareal@gmail.com",
    firstName: "Juan",
    lastName: "Villareal",
    schoolId: 1,
    studentCode: "AF2005",
  },
];

const courses = [
  {
    schoolId: 1,
    name: "Historia",
    topics:
      "Primera guerra mundial, segunda guerra mundial, guerra fria, guerra de vietnam",
  },
  {
    schoolId: 1,
    name: "Matematica",
    topics:
      "Funcion lineal, función cuadratica, función hiperbolica, maximos y minimos, derivadas e integrales",
  },
  {
    schoolId: 1,
    name: "Fisica",
    topics: "Cinematica, estatica, dinamica",
  },
];

const grades = [
  {
    schoolId: 1,
    name: "1° A",
  },
  {
    schoolId: 1,
    name: "1° B",
  },
  {
    schoolId: 1,
    name: "5° A",
  },
  {
    schoolId: 1,
    name: "5° A",
  },
];

const classrooms = [
  {
    schoolId: 1,
    name: "Aula 1",
  },
  {
    schoolId: 1,
    name: "Aula 2",
  },
  {
    schoolId: 1,
    name: "Aula 3",
  },
];

const instances = [
  {
    courseId: 1,
    professorId: 1,
    classroomId: 1,
    gradeId: 1,
  },
  {
    courseId: 2,
    professorId: 2,
    classroomId: 2,
    gradeId: 2,
  },
];

const schedules: NewSchedule[] = [
  {
    instanceId: 1,
    weekday: "monday",
    startTime: "14:00:00",
    endTime: "14:45:00",
  },
  {
    instanceId: 1,
    weekday: "wednesday",
    startTime: "09:00:00",
    endTime: "09:45:00",
  },
];

const lectures = [
  {
    scheduleId: 1,
    notes: "",
    date: new Date("2023-08-05"),
  },
  {
    scheduleId: 1,
    notes: "",
    date: new Date("2023-08-05"),
  },
];

const attendances = [
  {
    studentId: 1,
    lectureId: 1,
    isPresent: true,
  },
  {
    studentId: 2,
    lectureId: 1,
    isPresent: true,
  },
  {
    studentId: 3,
    lectureId: 1,
    isPresent: false,
  },
];

const scores = [
  {
    testId: 1,
    studentId: 1,
    score: 4,
  },
  {
    testId: 1,
    studentId: 2,
    score: 7,
  },
  {
    testId: 1,
    studentId: 3,
    score: 10,
  },
];

const tests = [
  {
    instanceId: 1,
    title: "Primera evaluación",
    topics: "Primera guerra mundial",
    date: "2024-04-01",
  },
];

async function loadData() {
  await db.transaction(async (tx) => {
    await tx.insert(school).values(schools);
    await tx.insert(user).values(users);
    await tx.insert(course).values(courses);
    await tx.insert(grade).values(grades);
    await tx.insert(student).values(students);
    await tx.insert(classroom).values(classrooms);
    await tx.insert(instance).values(instances);
    await tx.insert(schedule).values(schedules);
    await tx.insert(lecture).values(lectures);
    await tx.insert(attendance).values(attendances);
    await tx.insert(test).values(tests);
    await tx.insert(score).values(scores);
  });
  poolConnection.end();
}

loadData();
