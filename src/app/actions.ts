"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db/db";
import { attendance, lecture, studentContact } from "@/db/schema";

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
