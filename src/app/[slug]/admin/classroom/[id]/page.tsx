import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import Button from "@/components/button";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { classroom } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const currentClassroom = await db.query.classroom.findFirst({
    where: (classroom, { eq }) => eq(classroom.id, Number(params.id)),
  });

  if (!currentClassroom) {
    redirect(`/${params.slug}/classroom`);
  }

  const update = async (data: FormData) => {
    "use server";
    const classroomType = z.object({
      name: z.string(),
    });
    const newClassroom = classroomType.safeParse({
      name: data.get("name"),
    });
    if (!newClassroom.success) {
      return;
    }
    await db.update(classroom).set({
      name: newClassroom.data.name,
    }).where(eq(classroom.id, Number(params.id)));
    redirect(`/${params.slug}/admin/classroom`);
  };

  const del = async () => {
    "use server";
    await db.delete(classroom).where(
      eq(classroom.id, Number(params.id)),
    );

    redirect(`/${params.slug}/admin/classroom`);
  };

  return (
    <section>
      <h1 className="text-4xl ml-5">Modificar curso</h1>
      <div className="bg-primary-100 flex flex-col gap-5 m-5 p-4 rounded-xl">
        <form action={update}>
          <TextField
            id=""
            name="name"
            label="Nombre"
            defaultValue={currentClassroom.name}
            required
          />
          <Button color="tertiary" type="submit">Guardar</Button>
        </form>
        <form action={del} className="relative -top-[60px] left-28">
          <Button color="error" type="submit">Borrar</Button>
        </form>
      </div>
    </section>
  );
}
