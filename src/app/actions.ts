"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { typeToFlattenedError } from "zod";

import { db } from "@/db/db";
import {
  attendance,
  classroom,
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

type AdminModel = "classroom";

const updateAdminModelSchema = z.discriminatedUnion("model", [
  z.object({
    model: z.literal("classroom"),
    name: z.string(),
  }),
]);

export type UpdateAdminModelResult =
  | {
    success: true;
    message: string;
  }
  | {
    success: false;
    error:
      | string
      | typeToFlattenedError<z.infer<typeof updateAdminModelSchema>>;
  };

export async function updateAdminModel(
  model: AdminModel,
  slug: string,
  classroomId: number,
  _prevState: UpdateAdminModelResult,
  data: FormData,
): Promise<UpdateAdminModelResult> {
  if (model === "classroom") {
    const newClassroom = updateAdminModelSchema.safeParse({
      model,
      name: data.get("name"),
    });
    if (!newClassroom.success) {
      return { success: false, error: newClassroom.error.flatten() };
    }
    try {
      await db
        .update(classroom)
        .set({
          name: newClassroom.data.name,
        })
        .where(eq(classroom.id, classroomId));
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
    revalidatePath(`/${slug}/admin/classroom/${classroomId}`);
  }
  return { success: true, message: "Se ha actualizado correctamente." };
}

export type DeleteAdminModelResult =
  | {
    success: true;
    message: string;
  }
  | {
    success: false;
    error: string;
  };

export async function deleteClassroom(
  model: AdminModel,
  slug: string,
  classroomId: number,
  _prevState: { success: boolean },
  _data: FormData,
): Promise<DeleteAdminModelResult> {
  if (model === "classroom") {
    try {
      await db
        .delete(classroom)
        .where(eq(classroom.id, classroomId));
    } catch {
      return { success: false, error: "Ha ocurrido un error." };
    }
    revalidatePath(`/${slug}/admin/classroom/${classroomId}`);
  }
  return { success: true, message: "Se ha borrado correctamente." };
}
