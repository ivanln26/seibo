import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db/db";
import { todo } from "@/db/schema";

export const revalidate = 0;

export default async function Home() {
  const todos = await db.select().from(todo);

  const create = async (formData: FormData) => {
    "use server";
    const t = z.object({
      content: z.string(),
    });
    const res = t.safeParse({
      content: formData.get("content"),
    });
    if (!res.success) {
      return;
    }
    await db.insert(todo).values({ content: res.data.content });
    redirect("/");
  };

  return (
    <main>
      <section>
        <h1 className="text-4xl">Todos</h1>
        <form action={create}>
          <input name="content" type="text" />
          <button type="submit">submit</button>
        </form>
      </section>
      <section>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <Link href={`/todo/${todo.id}`}>{todo.content}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
