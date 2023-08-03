import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

import {
    school,
    user,
    course,
    grade,
    instance,
    schedule,
    lecture,
    attendance,
    test,
    score,
    classroom,
    student
} from "@/db/schema";

dotenv.config();
const poolConnection = mysql.createPool(process.env.DATABASE_URL);
const db = drizzle(poolConnection);

async function loadData() {
    await db.insert(school).values(schools);
    await db.insert(user).values(users);
    await db.insert(course).values(courses);
    await db.insert(grade).values(grades);
    await db.insert(student).values(students);
    await db.insert(classroom).values(classrooms);
    await db.insert(instance).values(instances);
    poolConnection.end()
}

loadData()

const schools = [
    {
        name: "ITS Villada",
        settings: { primaryColor: 1 }
    },
    {
        name: "La Salle",
        settings: { primaryColor: 1 }
    }
]

const users = [
    {
        email: "mateocetti2000@gmail.com",
        firstName: "Mateo",
        lastName: "Cetti"
    },
    {
        email: "ramiroghilino@gmail.com",
        firstName: "Ramiro",
        lastName: "Ghilino"
    },
    {
        email: "manuelbobadilla@gmail.com",
        firstName: "Manuel",
        lastName: "Bobadilla"
    },
    {
        email: "ivannunez@gmail.com",
        firstName: "Ivan",
        lastName: "Nuñez"
    },
    {
        email: "juanvillareal@gmail.com",
        firstName: "Juan",
        lastName: "Villareal"
    },
]

const students = [
    {
        email: "mateocetti2000@gmail.com",
        firstName: "Mateo",
        lastName: "Cetti",
        schoolId: 1,
        studentCode: "AF2001"
    },
    {
        email: "ramiroghilino@gmail.com",
        firstName: "Ramiro",
        lastName: "Ghilino",
        schoolId: 1,
        studentCode: "AF2001"
    },
    {
        email: "manuelbobadilla@gmail.com",
        firstName: "Manuel",
        lastName: "Bobadilla",
        schoolId: 1,
        studentCode: "AF2001"
    },
    {
        email: "ivannunez@gmail.com",
        firstName: "Ivan",
        lastName: "Nuñez",
        schoolId: 1,
        studentCode: "AF2001"
    },
    {
        email: "juanvillareal@gmail.com",
        firstName: "Juan",
        lastName: "Villareal",
        schoolId: 1,
        studentCode: "AF2001"
    },
]

const courses = [
    {
        schoolId: 1,
        name: "Historia",
        topics: "Primera guerra mundial, segunda guerra mundial, guerra fria, guerra de vietnam"
    },
    {
        schoolId: 1,
        name: "Matematica",
        topics: "Funcion lineal, función cuadratica, función hiperbolica, maximos y minimos, derivadas e integrales"
    },
    {
        schoolId: 1,
        name: "Fisica",
        topics: "Cinematica, estatica, dinamica"
    },
]

const grades = [
    {
        schoolId: 1,
        name: "1° A"
    },
    {
        schoolId: 1,
        name: "1° B"
    },
    {
        schoolId: 1,
        name: "5° A"
    },
    {
        schoolId: 1,
        name: "5° A"
    },
]

const classrooms = [
    {
        schoolId: 1,
        name: "Aula 1"
    },
    {
        schoolId: 1,
        name: "Aula 2"
    },
    {
        schoolId: 1,
        name: "Aula 3"
    },
]

const instances = [
    {
        courseId: 1,
        professorId: 1,
        classroomId: 1,
        gradeId:1,
    },
    {
        courseId: 2,
        professorId: 2,
        classroomId: 2,
        gradeId:2,
    },
]