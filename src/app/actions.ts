"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { typeToFlattenedError } from "zod";

import env from "@/env";
import { db } from "@/db/db";
import {
  attendance,
  classroom,
  course,
  grade,
  instance,
  lecture,
  schedule,
  schoolUser,
  score,
  student,
  studentContact,
  studentGrade,
  user,
} from "@/db/schema";
import type { StudentContact } from "@/db/schema";
import { transporter } from "@/mail";

const sendMailSchemas = {
  all: z.object({
    subject: z.string().min(1),
    body: z.string().min(1),
  }),
  grade: z.object({
    subject: z.string().min(1),
    body: z.string().min(1),
    grade: z.coerce.number(),
  }),
  student: z.object({
    subject: z.string().min(1),
    body: z.string().min(1),
    student: z.coerce.number(),
  }),
} as const;

export type SendMailsResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function sendMails(
  option: keyof typeof sendMailSchemas,
  _prevState: SendMailsResult,
  data: FormData,
): Promise<SendMailsResult> {
  let subject = "";
  let body = "";
  let contacts: StudentContact[] = [];

  if (option === "all") {
    const mail = sendMailSchemas["all"].safeParse({
      subject: data.get("subject"),
      body: data.get("body"),
    });
    if (!mail.success) {
      return { success: false, error: "Ha ocurrido un error." };
    }
    subject = mail.data.subject;
    body = mail.data.body;
    // TODO: filtrar por la escuela correspondiente.
    contacts = await db.select().from(studentContact);
  } else if (option === "grade") {
    const mail = sendMailSchemas["grade"].safeParse({
      subject: data.get("subject"),
      body: data.get("body"),
      grade: data.get("grade"),
    });
    if (!mail.success) {
      return { success: false, error: "Ha ocurrido un error." };
    }
    // TODO: validar que el grade id sea realmente de la institucion enviada.
    subject = mail.data.subject;
    body = mail.data.body;
    contacts = await db
      .select({
        id: studentContact.id,
        studentId: studentContact.studentId,
        name: studentContact.name,
        email: studentContact.email,
        phone: studentContact.phone,
        type: studentContact.type,
      })
      .from(studentContact)
      .innerJoin(student, eq(studentContact.studentId, student.id))
      .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
      .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
      .where(eq(grade.id, mail.data.grade));
  } else if (option === "student") {
    const mail = sendMailSchemas["student"].safeParse({
      subject: data.get("subject"),
      body: data.get("body"),
      student: data.get("student"),
    });
    if (!mail.success) {
      return { success: false, error: "Ha ocurrido un error." };
    }
    // TODO: validar que el student id sea realmente de la institucion enviada.
    subject = mail.data.subject;
    body = mail.data.body;
    contacts = await db
      .select({
        id: studentContact.id,
        studentId: studentContact.studentId,
        name: studentContact.name,
        email: studentContact.email,
        phone: studentContact.phone,
        type: studentContact.type,
      })
      .from(studentContact)
      .innerJoin(student, eq(studentContact.studentId, student.id))
      .where(eq(student.id, mail.data.student));
  }

  const promises = contacts.map(({ email }) =>
    transporter.sendMail({
      from: env.NODEMAILER_EMAIL,
      to: email,
      subject: subject,
      text: body,
    })
  );
  await Promise.all(promises);

  return { success: true, message: "Se han enviado los mails correctamente." };
}

export async function updateAssistances(
  slug: string,
  lectureID: number,
  _prevState: { success: boolean },
  data: FormData,
) {
  const studentRE = /student-(\d+)/i;
  const attendanceRE = /attendance-(\d+)/i;

  for (const [key, value] of data.entries()) {
    const studentMatch = studentRE.exec(key);
    if (studentMatch !== null) {
      await db
        .insert(attendance)
        .values({
          lectureId: lectureID,
          studentId: Number(studentMatch[1]),
          isPresent: value === "on",
        });
      continue;
    }

    const attendanceMatch = attendanceRE.exec(key);
    if (attendanceMatch !== null) {
      await db
        .update(attendance)
        .set({ isPresent: value === "on" })
        .where(eq(attendance.id, Number(attendanceMatch[1])));
      continue;
    }

    if (key === "notes") {
      await db
        .update(lecture)
        .set({ notes: String(value) })
        .where(eq(lecture.id, lectureID));
    }
  }

  revalidatePath(`/${slug}/lecture/${lectureID}`);
  return { success: true };
}

export async function updateScores(
  slug: string,
  testId: number,
  _prevState: { success: boolean },
  data: FormData,
): Promise<{ success: boolean }> {
  const studentRE = /student-(\d+)/i;
  const scoreRE = /score-(\d+)/i;

  for (const [key, value] of data) {
    const scoreMatch = scoreRE.exec(key);
    if (scoreMatch !== null) {
      if (value === "absent") {
        await db.delete(score).where(eq(score.id, Number(scoreMatch[1])));
        continue;
      }
      if (Number.isNaN(value)) continue;
      await db
        .update(score)
        .set({ score: Number(value) })
        .where(eq(score.id, Number(scoreMatch[1])));
      continue;
    }

    const studentMatch = studentRE.exec(key);
    if (studentMatch !== null) {
      if (value === "absent" || Number.isNaN(value)) continue;
      await db
        .insert(score)
        .values({
          testId: testId,
          studentId: Number(studentMatch[1]),
          score: Number(value),
        });
    }
  }

  revalidatePath(`/${slug}/test/${testId}`);
  return { success: true };
}

const updateAdminSchemas = {
  classroom: z.object({ name: z.string() }),
  course: z.object({
    name: z.string(),
    topics: z.string(),
  }),
  grade: z.object({ name: z.string() }),
  instance: z.object({
    courseId: z.coerce.number(),
    classroomId: z.coerce.number(),
    professorId: z.coerce.number(),
    gradeId: z.coerce.number(),
  }),
  schedule: z.object({
    instanceId: z.coerce.number(),
    weekday: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]),
    startTime: z.string(),
    endTime: z.string(),
  }),
  student: z.object({
    studentCode: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    studentGradeId: z.coerce.number(),
    // TODO: add studentContact
  }),
  user: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(["teacher", "tutor", "principal", "admin"]),
    isActive: z.coerce.boolean().default(false),
  }),
} as const;

export type UpdateAdminModelResult<T extends keyof typeof updateAdminSchemas> =
  | { success: true; message: string }
  | {
    success: false;
    error: string | typeToFlattenedError<z.infer<typeof updateAdminSchemas[T]>>;
  };

export async function updateAdminModel<
  T extends keyof typeof updateAdminSchemas,
>(
  model: T,
  slug: string,
  modelId: number,
  _prevState: UpdateAdminModelResult<T>,
  data: FormData,
): Promise<UpdateAdminModelResult<T>> {
  if (model === "classroom") {
    const newClassroom = updateAdminSchemas["classroom"].safeParse({
      name: data.get("name"),
    });

    if (!newClassroom.success) {
      return { success: false, error: newClassroom.error.flatten() };
    }

    try {
      await db
        .update(classroom)
        .set({ ...newClassroom.data })
        .where(eq(classroom.id, modelId));
    } catch (err) {
      if (
        err instanceof Object && "code" in err && err.code === "ER_DUP_ENTRY"
      ) {
        return {
          success: false,
          error: `Ya existe un aula con el nombre "${newClassroom.data.name}".`,
        };
      }
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}/admin/classroom/${modelId}`);
  } else if (model === "course") {
    const newCourse = updateAdminSchemas["course"].safeParse({
      name: data.get("name"),
      topics: data.get("topics"),
    });

    if (!newCourse.success) {
      return { success: false, error: newCourse.error.flatten() };
    }

    try {
      await db
        .update(course)
        .set({ ...newCourse.data })
        .where(eq(course.id, modelId));
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}/admin/course/${modelId}`);
  } else if (model === "grade") {
    const newGrade = updateAdminSchemas["grade"].safeParse({
      name: data.get("name"),
    });

    if (!newGrade.success) {
      return { success: false, error: newGrade.error.flatten() };
    }

    try {
      await db
        .update(grade)
        .set({ ...newGrade.data })
        .where(eq(grade.id, modelId));
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}/admin/grade/${modelId}`);
  } else if (model === "instance") {
    const newInstance = updateAdminSchemas["instance"].safeParse({
      courseId: data.get("course"),
      classroomId: data.get("classroom"),
      professorId: data.get("professor"),
      gradeId: data.get("grade"),
    });

    if (!newInstance.success) {
      return { success: false, error: newInstance.error.flatten() };
    }

    try {
      await db
        .update(instance)
        .set({ ...newInstance.data })
        .where(eq(instance.id, modelId));
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}/admin/instance/${modelId}`);
  } else if (model === "schedule") {
    const newSchedule = updateAdminSchemas["schedule"].safeParse({
      instanceId: data.get("instance"),
      weekday: data.get("weekday"),
      startTime: data.get("start"),
      endTime: data.get("end"),
    });

    if (!newSchedule.success) {
      return { success: false, error: newSchedule.error.flatten() };
    }

    try {
      await db
        .update(schedule)
        .set({ ...newSchedule.data })
        .where(eq(schedule.id, modelId));
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}/admin/schedule/${modelId}`);
  } else if (model === "student") {
    const newStudent = updateAdminSchemas["student"].safeParse({
      studentCode: data.get("studentCode"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      studentGradeId: data.get("studentGrade"),
    });

    if (!newStudent.success) {
      return { success: false, error: newStudent.error.flatten() };
    }

    try {
      await db
        .update(student)
        .set({
          studentCode: newStudent.data.studentCode,
          firstName: newStudent.data.firstName,
          lastName: newStudent.data.lastName,
          email: newStudent.data.email,
        })
        .where(eq(student.id, modelId));
      await db
        .update(studentGrade)
        .set({ gradeId: newStudent.data.studentGradeId })
        .where(eq(studentGrade.studentId, modelId));
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}/admin/student/${modelId}`);
  } else if (model === "user") {
    const newUser = updateAdminSchemas["user"].safeParse({
      name: data.get("name"),
      email: data.get("email"),
      role: data.get("role"),
      isActive: data.get("isActive"),
    });

    if (!newUser.success) {
      return { success: false, error: newUser.error.flatten() };
    }

    try {
      await db.transaction(async (tx) => {
        const query = await tx
          .select({ id: user.id })
          .from(user)
          .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
          .where(eq(schoolUser.id, modelId));

        if (query.length !== 1) {
          throw new Error();
        }

        await tx
          .update(user)
          .set({ name: newUser.data.name, email: newUser.data.email })
          .where(eq(user.id, query[0].id));

        await tx
          .update(schoolUser)
          .set({ role: newUser.data.role, isActive: newUser.data.isActive })
          .where(eq(schoolUser.id, modelId));
      });
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}/admin/user/${modelId}`);
  }
  return { success: true, message: "Se ha actualizado correctamente." };
}

type AdminModel =
  | "classroom"
  | "course"
  | "grade"
  | "instance"
  | "schedule"
  | "student";

export type DeleteAdminModelResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function deleteAdminModel(
  model: AdminModel,
  slug: string,
  modelId: number,
  _prevState: DeleteAdminModelResult,
  _data: FormData,
): Promise<DeleteAdminModelResult> {
  if (model === "classroom") {
    try {
      await db
        .delete(classroom)
        .where(eq(classroom.id, modelId));
    } catch {
      return { success: false, error: "Ha ocurrido un error." };
    }
    revalidatePath(`/${slug}/admin/classroom/${modelId}`);
  } else if (model === "course") {
    try {
      await db
        .delete(course)
        .where(eq(course.id, modelId));
    } catch {
      return { success: false, error: "Ha ocurrido un error." };
    }
    revalidatePath(`/${slug}/admin/course/${modelId}`);
  } else if (model === "grade") {
    try {
      await db
        .delete(grade)
        .where(eq(grade.id, modelId));
    } catch {
      return { success: false, error: "Ha ocurrido un error." };
    }
    revalidatePath(`/${slug}/admin/grade/${modelId}`);
  } else if (model === "instance") {
    try {
      await db
        .delete(instance)
        .where(eq(instance.id, modelId));
    } catch {
      return { success: false, error: "Ha ocurrido un error." };
    }
    revalidatePath(`/${slug}/admin/instance/${modelId}`);
  } else if (model === "schedule") {
    try {
      // FIXME: borrar lecture.
      await db
        .delete(schedule)
        .where(eq(schedule.id, modelId));
    } catch {
      return { success: false, error: "Ha ocurrido un error." };
    }
    revalidatePath(`/${slug}/admin/schedule/${modelId}`);
  } else if (model === "student") {
    try {
      // FIXME: borrar studentContact.
      await db
        .delete(studentGrade)
        .where(eq(studentGrade.studentId, modelId));
      await db
        .delete(student)
        .where(eq(student.id, modelId));
    } catch {
      return { success: false, error: "Ha ocurrido un error." };
    }
    revalidatePath(`/${slug}/admin/student/${modelId}`);
  }

  return { success: true, message: "Se ha borrado correctamente." };
}
