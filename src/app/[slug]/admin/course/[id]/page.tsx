import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { z } from "zod";
import { db } from "@/db/db";

import Button from "@/components/button";
import { course } from "@/db/schema";

import TextField from "@/components/text-field";

type Props = {
  params: {
    slug: string;
    id: number;
  };
};

export default async function Page({ params }: Props) {
  const actualCourse =
    (await db.select().from(course).where(eq(course.id, params.id)))[0];

  const update = async (formData: FormData) => {
    "use server";
    const t = z.object({
      id: z.coerce.number().int(),
      name: z.string(),
      topics: z.string(),
    });
    const res = t.safeParse({
      id: params.id,
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

  const del = async () => {
    "use server";
    await db.delete(course).where(
      eq(course.id, Number(params.id)),
    );
    redirect("/");
  };

  return (
    <section>
      <h1 className="text-4xl ml-5">Modificar curso</h1>
      <div className="bg-primary-100 flex flex-col gap-5 m-5 p-4 rounded-xl">
        <form action={update}>
          <TextField
            defaultValue={actualCourse.name}
            label="Nombre"
            id="name"
            name="name"
          />
          <TextField
            defaultValue={actualCourse.topics}
            label="Temas"
            id="topics"
            name="topics"
          />
          <Button color="tertiary" type="submit">Guardar</Button>
        </form>
        <form action={del}>
          <Button color="error" type="submit">Borrar</Button>
        </form>
      </div>
    </section>
  );
}
