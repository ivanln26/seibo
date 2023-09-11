"use server";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { attendance, lecture } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAssistances(formData: FormData) {
  const data = Array.from(formData.entries());
  // Nose porq pasa esto.
  if (data[0][0].startsWith("$ACTION_ID")) data.shift();

  const lectureID = data.shift();
  const notes = data.pop();
  if (
    notes === undefined
    || lectureID === undefined
  ) return;
  for (let pair of data) {
    if (pair[0].split(":")[0] === "student") {
      await db.insert(attendance)
        .values({
          lectureId: Number(lectureID[1]),
          studentId: Number(pair[0].split(":")[1]),
          isPresent: pair[1] === "on",
        });
    }
    else {
      await db.update(attendance)
        .set({ isPresent: pair[1] === "on" })
        .where(eq(attendance.id, Number(pair[0].split(":")[1])));
    }
  }

  await db.update(lecture)
    .set({ notes: String(notes[1]) })
    .where(eq(lecture.id, Number(lectureID[1])))

  revalidatePath(`lecture/${Number(lectureID[1])}`, );
}

