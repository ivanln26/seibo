import { between } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "@/db/db";
import { lecture, schedule } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Given a day of the week [0-6] (0 represents Sunday), returns the
 * date of that day of the following week.
 */
function nextWorkDay(dayOfWeek: number): Date {
  const d = new Date();
  const delta = (dayOfWeek + 7 - d.getDay()) % 7; // day difference until the next day of the week
  d.setDate(d.getDate() + delta);
  return d;
}

export async function GET(request: NextRequest) {
  const nextWeek = {
    "monday": nextWorkDay(1),
    "tuesday": nextWorkDay(2),
    "wednesday": nextWorkDay(3),
    "thursday": nextWorkDay(4),
    "friday": nextWorkDay(5),
  };

  const nextWeekLectures = await db.select()
    .from(lecture)
    .where(
      between(
        lecture.date,
        nextWeek["monday"],
        nextWeek["friday"],
      ),
    );

  if (nextWeekLectures.length > 0) {
    return NextResponse.json({
      "detail": "Next week's lectures have already been created.",
    }, { status: 400 });
  }

  const schedules = await db.select().from(schedule);

  for (const sch of schedules) {
    await db.insert(lecture).values({
      date: nextWeek[sch.weekday],
      scheduleId: sch.id,
    });
  }

  return NextResponse.json({
    "detail": "Lectures created successfully.",
  }, { status: 200 });
}
