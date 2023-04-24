import { prisma } from "@/db";
import Form from "@/components/form";

export const revalidate = 0;

export default async function Home() {
  const todos = await prisma.todo.findMany();

  return (
    <main>
      <section>
        <h1 className="text-4xl">Todos</h1>
        <Form />
      </section>
      <section>
        <ul>
          {todos.map((todo) => <li key={todo.id}>{todo.content}</li>)}
        </ul>
      </section>
    </main>
  );
}
