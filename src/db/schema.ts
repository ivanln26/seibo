import { InferModel } from "drizzle-orm";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const todo = mysqlTable("todo", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 256 }).notNull(),
});

export type Todo = InferModel<typeof todo>;
