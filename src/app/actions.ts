"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { typeToFlattenedError } from "zod";

import { db } from "@/db/db";
import {
  attendance,
  classroom,
  grade,
  instance,
  lecture,
  score,
  studentContact,
} from "@/db/schema";

type SendMailOption = "all" | "course" | "student";

const sendMailSchema = z.discriminatedUnion("option", [
  z.object({
    option: z.literal("all"),
    subject: z.string().min(1),
    body: z.string().min(1),
  }),
  z.object({
    option: z.literal("course"),
    subject: z.string().min(1),
    body: z.string().min(1),
    course: z.coerce.number(),
  }),
  z.object({
    option: z.literal("student"),
    subject: z.string().min(1),
    body: z.string().min(1),
    student: z.coerce.number(),
  }),
]);

export async function sendMails(
  option: SendMailOption,
  _prevState: { success: boolean },
  data: FormData,
): Promise<{ success: boolean }> {
  const obj = sendMailSchema.safeParse({
    option,
    subject: data.get("subject"),
    body: data.get("body"),
  });
  if (!obj.success) {
    return { success: false };
  }
  await db.select().from(studentContact);
  return { success: true };
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
  grade: z.object({ name: z.string() }),
  instance: z.object({
    courseId: z.coerce.number(),
    classroomId: z.coerce.number(),
    professorId: z.coerce.number(),
    gradeId: z.coerce.number(),
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
  }
  return { success: true, message: "Se ha actualizado correctamente." };
}

type AdminModel = "classroom" | "grade" | "instance";

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
  }
  return { success: true, message: "Se ha borrado correctamente." };
}
