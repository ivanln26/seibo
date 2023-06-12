import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, findUnique } from "@/db/db";
import { todo } from "@/db/schema";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const t = await findUnique(params.id);

  const update = async (formData: FormData) => {
    "use server";
    const t = z.object({
      id: z.coerce.number().int(),
      content: z.string(),
    });
    const res = t.safeParse({
      id: formData.get("id"),
      content: formData.get("content"),
    });
    if (!res.success) {
      return;
    }
    await db.update(todo).set({ content: res.data.content }).where(
      eq(todo.id, res.data.id),
    );
    redirect("/");
  };

  return (
    <main>
      <section>
        <form action={update}>
          <input name="content" defaultValue={t.content} type="text" />
          <input
            className="hidden"
            name="id"
            defaultValue={t.id}
            type="text"
          />
          <button type="submit">submit</button>
        </form>
      </section>
    </main>
  );
}
