'use server'
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { attendance } from "@/db/schema";
import { redirect } from "next/navigation";

export async function updateAssistances(formData: FormData) {
    const data = formData.entries();
    const lectureID = formData.get("lectureID")
    const listIsCreated = Boolean(formData.get("listIsCreated") === "1")

    if (listIsCreated) {
        await updateList(data);
    }
    else {
        await createList(data, Number(lectureID));
    }
    redirect(`lecture/${lectureID}`)
}

async function createList(data: IterableIterator<[string, FormDataEntryValue]>, lectureID: number) {
    for (let pair of data) {
        if (isNaN(Number(pair[0]))) continue;
        await db.insert(attendance)
            .values({
                lectureId: lectureID,
                studentId: Number(pair[0]),
                isPresent: pair[1] === "on"
            })
    }
}

async function updateList(data: IterableIterator<[string, FormDataEntryValue]>) {
    for (let pair of data) {
        if (isNaN(Number(pair[0]))) continue;
        await db.update(attendance)
            .set({ isPresent: pair[1] === "on" })
            .where(eq(attendance.id, Number(pair[0])))
    }
}