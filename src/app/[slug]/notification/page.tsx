import { eq } from "drizzle-orm";

import EmailSender from "./emailSender";
import { db } from "@/db/db";
import {
  grade,
  instance,
  student,
  studentContact,
  studentGrade,
} from "@/db/schema";
import { getUserProfile } from "@/db/queries";

const nodemailer = require("nodemailer");

enum options {
  all = 1,
  specific = 2,
  grade = 3,
  null = 0,
}

type Props = {
  params: {
    slug: string;
  };
};

async function sendMail(subject: string, toEmail: string, otpText: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    text: otpText,
  };

  return await transporter.sendMail(mailOptions);
}

export const revalidate = 0;

export default async function Page({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const actualSchool = await db.query.school.findFirst({
    where: (sch, { eq }) => eq(sch.slug, params.slug),
  });

  if (!actualSchool) return <>Error</>;

  const students = await db.select().from(student)
    .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
    .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
    .where(eq(student.schoolId, actualSchool.id));

  const grades = await db.select().from(grade)
    .where(eq(grade.schoolId, actualSchool.id));

  const userGrades = await db.select().from(grade)
    .innerJoin(instance, eq(instance.gradeId, grade.id))
    .where(eq(instance.professorId, user.id));

  async function sape(data: FormData) {
    "use server";
    const option = Number(data.get("option"));
    const subject = String(data.get("subject")).concat(" - ", String(actualSchool?.name));
    const optText = String(data.get("optText"));
    let parents;

    if (option === options.all) {
      parents = await db.select().from(studentContact)
        .innerJoin(student, eq(student.id, studentContact.studentId))
        .where(eq(student.schoolId, Number(actualSchool?.id)));
      for (const p of parents) {
        const res = await sendMail(subject, p.student_contact.email, optText);
        console.log(res);
      }
    } else if (option === options.grade) {
      const actualGrade = Number(data.get("grade"));
      parents = await db.select().from(studentContact)
        .innerJoin(student, eq(studentContact.studentId, student.id))
        .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
        .where(eq(studentGrade.gradeId, actualGrade));
      for (const p of parents) {
        const res = await sendMail(subject, p.student_contact.email, optText);
        console.log(res);
      }
    } else if (option === options.specific) {
      const student = Number(data.get("student"));
      parents = await db.select().from(studentContact)
        .where(eq(studentContact.studentId, student));
      for (const p of parents) {
        const res = await sendMail(subject, p.email, optText);
        console.log(res);
      }
    }
  }

  return (
    <main className="flex justify-center items-center w-full h-[100svh]">
      <section className="flex flex-col justify-center items-center gap-y-8 px-4 py-8 bg-primary-100 dark:bg-primary-700 rounded-xl">
        <h1 className="text-4xl text-primary-900 dark:text-primary-100">
          Notificación a madres y padres
        </h1>
        <form action={sape}>
          {/* FIXME: Se esta enviando todos los alumnos de la institución al dispositivo cliente. */}
          {user.profiles.find((e) => e.role === "admin")
            ? (
              <EmailSender
                students={students}
                grades={grades}
                roles={user.profiles}
              />
            )
            : (
              <EmailSender
                students={students}
                grades={userGrades.map((g) => g.grade)}
                roles={user.profiles}
              />
            )}
        </form>
      </section>
    </main>
  );
}
