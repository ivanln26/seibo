"use server";

import { and, eq } from "drizzle-orm";
import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { twColors } from "@/color";
import { db } from "@/db/db";
import {
  attendance,
  classroom,
  course,
  grade,
  gradeTutor,
  instance,
  lecture,
  schedule,
  school,
  schoolUser,
  score,
  student,
  studentContact,
  studentGrade,
  user,
} from "@/db/schema";
import type { Role, StudentContact } from "@/db/schema";
import { hasRoles } from "@/db/queries";
import type { UserProfile } from "@/db/queries";
import env from "@/env";
import { transporter } from "@/mail";
import { redirect } from "next/navigation";

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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type SendMailsResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function sendMails(
  userProfile: UserProfile,
  slug: string,
  option: keyof typeof sendMailSchemas,
  _prevState: SendMailsResult,
  data: FormData,
): Promise<SendMailsResult> {
  const isAdminOrPrincipal = await hasRoles(
    userProfile,
    "OR",
    "admin",
    "principal",
  );
  const isTeacher = await hasRoles(userProfile, "OR", "teacher");

  let subject = "";
  let body = "";
  let contacts: StudentContact[] = [];

  const selectData = {
    id: studentContact.id,
    studentId: studentContact.studentId,
    name: studentContact.name,
    email: studentContact.email,
    phone: studentContact.phone,
    type: studentContact.type,
  };

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
    contacts = await db
      .select(selectData)
      .from(studentContact)
      .innerJoin(student, eq(studentContact.studentId, student.id))
      .innerJoin(school, eq(student.schoolId, school.id))
      .where(eq(school.slug, slug));
  } else if (option === "grade") {
    const mail = sendMailSchemas["grade"].safeParse({
      subject: data.get("subject"),
      body: data.get("body"),
      grade: data.get("grade"),
    });
    if (!mail.success) {
      return { success: false, error: "Ha ocurrido un error." };
    }
    subject = mail.data.subject;
    body = mail.data.body;
    if (isAdminOrPrincipal) {
      contacts = await db
        .select(selectData)
        .from(studentContact)
        .innerJoin(student, eq(studentContact.studentId, student.id))
        .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
        .innerJoin(school, eq(student.schoolId, school.id))
        .where(
          and(
            eq(school.slug, slug),
            eq(studentGrade.gradeId, mail.data.grade),
          ),
        );
    } else if (isTeacher) {
      contacts = await db
        .selectDistinct(selectData)
        .from(studentContact)
        .innerJoin(student, eq(studentContact.studentId, student.id))
        .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
        .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
        .innerJoin(school, eq(grade.schoolId, school.id))
        .innerJoin(instance, eq(grade.id, instance.gradeId))
        .innerJoin(user, eq(instance.professorId, user.id))
        .where(
          and(
            eq(school.slug, slug),
            eq(grade.id, mail.data.grade),
            !isAdminOrPrincipal && isTeacher
              ? eq(user.id, userProfile.id)
              : undefined,
          ),
        );
    } // TODO: isTutor
  } else if (option === "student") {
    const mail = sendMailSchemas["student"].safeParse({
      subject: data.get("subject"),
      body: data.get("body"),
      student: data.get("student"),
    });
    if (!mail.success) {
      return { success: false, error: "Ha ocurrido un error." };
    }
    subject = mail.data.subject;
    body = mail.data.body;
    if (isAdminOrPrincipal) {
      contacts = await db
        .select(selectData)
        .from(studentContact)
        .innerJoin(student, eq(studentContact.studentId, student.id))
        .innerJoin(school, eq(student.schoolId, school.id))
        .where(
          and(
            eq(school.slug, slug),
            eq(student.id, mail.data.student),
          ),
        );
    } else if (isTeacher) {
      contacts = await db
        .selectDistinct(selectData)
        .from(studentContact)
        .innerJoin(student, eq(studentContact.studentId, student.id))
        .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
        .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
        .innerJoin(instance, eq(grade.id, instance.gradeId))
        .innerJoin(user, eq(instance.professorId, user.id))
        .innerJoin(school, eq(student.schoolId, school.id))
        .where(
          and(
            eq(school.slug, slug),
            eq(user.id, userProfile.id),
            eq(student.id, mail.data.student),
          ),
        );
    } // TODO: isTutor
  }

  if (contacts.length === 0) {
    return { success: false, error: "No hay contactos para enviar mails." };
  }

  const mails = contacts.map(({ email, }) => {
    return {
      from: env.NODEMAILER_EMAIL,
      to: email,
      subject: subject,
      text: body
    }
  })

  for (let i = 0; i < mails.length; i++) {
    await transporter.sendMail(mails[i],
      (err: any, info: any) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    await sleep(500);
  }

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
      if (isNaN(Number(value))) continue;
      await db
        .update(score)
        .set({ score: Number(value) })
        .where(eq(score.id, Number(scoreMatch[1])));
      continue;
    }

    const studentMatch = studentRE.exec(key);
    if (studentMatch !== null) {
      if (value === "absent" || isNaN(Number(value))) continue;
      await db
        .insert(score)
        .values({
          testId: testId,
          studentId: Number(studentMatch[1]),
          score: Number(value),
        });
    }
  }

  redirect(`/${slug}/test/`);
  // return { success: true };
}

const createAdminSchemas = {
  user: z.object({
    name: z.string(),
    email: z.string().email(),
    roles: z.array(z.union([
      z.enum(["teacher", "tutor", "principal", "admin"]),
      z.literal(""),
      z.literal(null),
    ])),
  }).transform((val) => ({
    ...val,
    roles: val.roles.filter((role): role is Role =>
      role !== "" && role !== null
    ),
  })).refine((val) => val.roles.length !== 0, {
    message: "Se debe seleccionar al menos un rol.",
  }),
} as const;

export type CreateAdminModelResult<T extends keyof typeof createAdminSchemas> =
  | { success: true; message: string }
  | {
    success: false;
    error:
    | string
    | z.inferFlattenedErrors<
      z.ZodType<z.input<typeof createAdminSchemas[T]>>
    >;
  };

export async function createAdminModel<
  T extends keyof typeof createAdminSchemas,
>(
  model: T,
  slug: string,
  _prevState: CreateAdminModelResult<T>,
  data: FormData,
): Promise<CreateAdminModelResult<T>> {
  if (model === "user") {
    const newUser = createAdminSchemas[model].safeParse({
      name: data.get("name"),
      email: data.get("email"),
      roles: [
        data.get("teacher") && "teacher",
        data.get("tutor") && "tutor",
        data.get("principal") && "principal",
        data.get("admin") && "admin",
      ],
    });
    if (!newUser.success) {
      return { success: false, error: newUser.error.flatten() };
    }

    const u = await db
      .select()
      .from(user)
      .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
      .innerJoin(school, eq(schoolUser.schoolId, school.id))
      .where(and(
        eq(school.slug, slug),
        eq(user.email, newUser.data.email),
      ));

    if (u.length !== 0) {
      return {
        success: false,
        error: "Ya existe un usuario con ese email en esta institución.",
      };
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .insert(user)
          .values({ name: newUser.data.name, email: newUser.data.email })
          .onDuplicateKeyUpdate({ set: { name: newUser.data.name } });
        const u = await tx.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, newUser.data.email),
        });
        const s = await tx.query.school.findFirst({
          where: (school, { eq }) => eq(school.slug, slug),
        });
        if (u === undefined || s === undefined) throw new Error();
        for (const role of newUser.data.roles) {
          await tx
            .insert(schoolUser)
            .values({
              schoolId: s.id,
              userId: u.id,
              role: role,
              isActive: true,
            });
        }
      });
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }
  }
  return { success: true, message: "Se ha creado correctamente." };
}

const termDate = z.coerce.date()
  .refine((val) => val.getUTCFullYear() === (new Date()).getUTCFullYear(), {
    message: `El año no puede ser distinto a ${(new Date()).getUTCFullYear()}`,
  })
  .transform((val) => val.toISOString().substring(0, 10));

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
  settings: z.object({
    primary: z.enum(twColors),
    secondary: z.enum(twColors),
    firstTermStart: termDate,
    firstTermEnd: termDate,
    secondTermStart: termDate,
    secondTermEnd: termDate,
    thirdTermStart: termDate,
    thirdTermEnd: termDate,
  }).refine((val) => val.firstTermEnd > val.firstTermStart, {
    message: "No puede ser inferior al inicio del primer trimestre",
    path: ["firstTermEnd"],
  }).refine((val) => val.secondTermStart > val.firstTermEnd, {
    message: "No puede ser inferior al final del primer trimestre",
    path: ["secondTermStart"],
  }).refine((val) => val.secondTermEnd > val.secondTermStart, {
    message: "No puede ser inferior al inicio del segundo trimestre",
    path: ["secondTermEnd"],
  }).refine((val) => val.thirdTermStart > val.secondTermEnd, {
    message: "No puede ser inferior al final del segundo trimestre",
    path: ["thirdTermStart"],
  }).refine((val) => val.thirdTermEnd > val.thirdTermStart, {
    message: "No puede ser inferior al inicio del tercer trimestre",
    path: ["thirdTermEnd"],
  }).transform((val) => ({
    color: {
      primary: val.primary,
      secondary: val.secondary,
    },
    terms: {
      first: {
        start: val.firstTermStart,
        end: val.firstTermEnd,
      },
      second: {
        start: val.secondTermStart,
        end: val.secondTermEnd,
      },
      third: {
        start: val.thirdTermStart,
        end: val.thirdTermEnd,
      },
    },
  })),
  student: z.object({
    studentCode: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    studentGradeId: z.coerce.number(),
    // TODO: add studentContact
  }),
  tutor: z.object({
    name: z.string(),
    email: z.string(),
    isActive: z.coerce.boolean().default(false),
    // TODO: add grades
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
    error:
    | string // TODO: remove string type
    | z.inferFlattenedErrors<
      z.ZodType<z.input<typeof updateAdminSchemas[T]>>
    >;
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
  } else if (model === "settings") {
    const logo = data.get("logo");
    if (logo instanceof File && logo.size > 0 && logo.size < 5e6) {
      const filepath = `${process.cwd()}/public/logo/${slug}.png`;
      const data = Buffer.from(await logo.arrayBuffer());
      await fs.writeFile(filepath, data);
    }
    const newSettings = updateAdminSchemas["settings"].safeParse({
      primary: data.get("primary"),
      secondary: data.get("secondary"),
      firstTermStart: data.get("first-term-start"),
      firstTermEnd: data.get("first-term-end"),
      secondTermStart: data.get("second-term-start"),
      secondTermEnd: data.get("second-term-end"),
      thirdTermStart: data.get("third-term-start"),
      thirdTermEnd: data.get("third-term-end"),
    });

    if (!newSettings.success) {
      return { success: false, error: newSettings.error.flatten() };
    }

    try {
      await db
        .update(school)
        .set({ settings: newSettings.data })
        .where(eq(school.slug, slug));
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }

    revalidatePath(`/${slug}`);
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
  } else if (model === "tutor") {
    const newTutor = updateAdminSchemas["tutor"].safeParse({
      name: data.get("name"),
      email: data.get("email"),
      isActive: data.get("isActive"),
    });

    if (!newTutor.success) {
      return { success: false, error: newTutor.error.flatten() };
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(user)
          .set({ name: newTutor.data.name, email: newTutor.data.email })
          .where(eq(user.id, modelId));
        await tx
          .update(schoolUser)
          .set({ isActive: newTutor.data.isActive })
          .where(and(
            eq(schoolUser.role, "tutor"),
            eq(schoolUser.userId, modelId),
          ));

        // Maybe optimize
        await tx
          .delete(gradeTutor)
          .where(eq(gradeTutor.tutorId, modelId));
        const gradeRE = /grade-(\d+)/i;
        for (const [key, value] of data.entries()) {
          const gradeMatch = gradeRE.exec(key);
          if (gradeMatch !== null && value === "on") {
            await tx
              .insert(gradeTutor)
              .values({ gradeId: Number(gradeMatch[1]), tutorId: modelId });
          }
        }
      });
    } catch {
      return {
        success: false,
        error: "Ha ocurrido un error en la base de datos.",
      };
    }
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
