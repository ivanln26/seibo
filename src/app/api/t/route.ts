import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/db/db";
import { school, schoolUser, user } from "@/db/schema";

const schema = z.object({
  slug: z.string(),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = schema.safeParse(body);

  if (!res.success) {
    return Response.json({});
  }

  const query = await db.select({ role: schoolUser.role })
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .innerJoin(school, eq(schoolUser.schoolId, school.id))
    .where(
      and(
        eq(user.email, res.data.email),
        eq(school.slug, res.data.slug),
        eq(schoolUser.isActive, true),
      ),
    );

  const roles = query.map((row) => row.role);

  return Response.json({ roles });
}
