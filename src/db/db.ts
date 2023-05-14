import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import env from "@/env";
import { todo } from "./schema";
import type { Todo } from "./schema";

const poolConnection = mysql.createPool(env.DATABASE_URL);

export const db = drizzle(poolConnection);

export async function findUnique(id: number | string): Promise<Todo> {
  const query = await db.select().from(todo).where(eq(todo.id, Number(id)));
  if (query.length !== 1) {
    throw Error(`query returned ${query.length} values`);
  }
  return query[0];
}
