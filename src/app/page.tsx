import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/db";

export const revalidate = 0;

const create = async (formData: FormData) => {
  "use server";
  const todo = z.object({
    content: z.string(),
  });
  const res = todo.safeParse({
    content: formData.get("content"),
  });
  if (!res.success) {
    return;
  }
  await prisma.todo.create({ data: res.data });
  redirect("/");
};

export default async function Home() {
  const todos = await prisma.todo.findMany();

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
