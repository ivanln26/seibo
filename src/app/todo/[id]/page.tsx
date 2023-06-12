import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, findUnique } from "@/db/db";
import { course } from "@/db/schema";

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
      name: z.string(),
      topics: z.string(),
    });
    const res = t.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      topics: formData.get("topics"),
    });
    if (!res.success) {
      return;
    }
    await db.update(course).set({
      name: res.data.name,
      topics: res.data.topics,
    }).where(
      eq(course.id, res.data.id),
    );
    redirect("/");
  };

  return (
    <main>
      <section>
        <form action={update}>
          <input name="name" defaultValue={t.name} type="text" />
          <input name="topics" defaultValue={t.topics} type="text" />
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
