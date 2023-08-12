'use server'

import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import {
    attendance,
} from "@/db/schema";

export async function updateAssistances(formData: FormData) {
    const data = formData.entries();
    const lectureID= formData.get("lectureID")
    const listIsCreated = Boolean(formData.get("listIsCreated"))

    if (listIsCreated) {
      for (let pair of data) {
        if (isNaN(Number(pair[0]))) continue;
        await db.update(attendance)
          .set({ isPresent: pair[1] === "on" })
          .where(eq(attendance.id, Number(pair[0])))
      }
    } else {
      for (let pair of data) {
        if (isNaN(Number(pair[0]))) continue;
        await db.insert(attendance)
          .values({
            lectureId: Number(lectureID),
            studentId: Number(pair[0]),
            isPresent: pair[1] === "on"
          })
      }
    }
    // redirect(pathName)
  }