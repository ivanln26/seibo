import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import env from "@/env";
import { course } from "./schema";
import type { Course } from "./schema";
import * as schema from "./schema";

const poolConnection = mysql.createPool(env.DATABASE_URL);

export const db = drizzle(poolConnection, { schema, mode: "default" });

export async function findUnique(id: number | string): Promise<Course> {
  const query = await db.select().from(course).where(eq(course.id, Number(id)));
  if (query.length !== 1) {
    throw Error(`query returned ${query.length} values`);
  }
  return query[0];
}
