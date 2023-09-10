"use server";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { attendance, lecture } from "@/db/schema";
import { redirect } from "next/navigation";

export async function updateAssistances(formData: FormData) {
  const data = Array.from(formData.entries());

  const notes = data.pop();
  const lectureID = data.shift();
  const placeholder = data.shift();
  if (
    placeholder === undefined ||
    notes === undefined ||
    lectureID === undefined
  ) return;

  const listIsCreated = placeholder[1] === "1";

  if (listIsCreated) {
    await updateList(data);
  } else {
    await createList(data, Number(lectureID));
  }
  await db.update(lecture)
    .set({ notes: String(notes[1]) })
    .where(eq(lecture.id, Number(lectureID[1])));
  redirect(`lecture/${Number(lectureID[1])}`);
}

async function createList(
  data: Array<[string, FormDataEntryValue]>,
  lectureID: number,
) {
  for (let pair of data) {
    await db.insert(attendance)
      .values({
        lectureId: lectureID,
        studentId: Number(pair[0]),
        isPresent: pair[1] === "on",
      });
  }
}

async function updateList(
  data: Array<[string, FormDataEntryValue]>,
) {
  for (let pair of data) {
    await db.update(attendance)
      .set({ isPresent: pair[1] === "on" })
      .where(eq(attendance.id, Number(pair[0])));
  }
}
