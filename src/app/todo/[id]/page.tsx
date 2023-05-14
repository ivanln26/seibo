import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/db";

type Props = {
  params: {
    id: string;
  };
};

const update = async (formData: FormData) => {
  "use server";
  const todo = z.object({
    id: z.coerce.number().int(),
    content: z.string(),
  });
  const res = todo.safeParse({
    id: formData.get("id"),
    content: formData.get("content"),
  });
  if (!res.success) {
    return;
  }
  await prisma.todo.update({
    where: { id: res.data.id },
    data: { content: res.data.content },
  });
  redirect("/");
};

export default async function Page({ params }: Props) {
  const todo = await prisma.todo.findUnique({
    where: { id: Number(params.id) },
  });

  return (
    <main>
      <section>
        <form action={update}>
          <input name="content" defaultValue={todo?.content} type="text" />
          <input
            className="hidden"
            name="id"
            defaultValue={todo?.id}
            type="text"
          />
          <button type="submit">submit</button>
        </form>
      </section>
    </main>
  );
}
