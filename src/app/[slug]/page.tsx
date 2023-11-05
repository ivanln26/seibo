import { revalidatePath } from "next/cache";
import { z } from "zod";

import TextField from "@/components/text-field";
import Modal from "@/components/modal";
import { db } from "@/db/db";
import { course } from "@/db/schema";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Home({ params }: Props) {
  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (!school) {
    return <>No se encontró la escuela.</>;
  }

  const courses = await db.select().from(course);
  const columnNames = ["id", "schoolId", "name", "topics"];

  const create = async (formData: FormData) => {
    "use server";
    const t = z.object({
      content: z.string(),
      topics: z.string(),
    });
    const res = t.safeParse({
      content: formData.get("content"),
      topics: formData.get("topics"),
    });
    if (!res.success) {
      return;
    }
    await db.insert(course).values({
      name: res.data.content,
      topics: res.data.topics,
      schoolId: 1,
    });
    revalidatePath("/");
  };

  return (
    <>
      <section>
        <h1 className="text-4xl">{school.name}</h1>
        <h1 className="text-4xl">Courses</h1>
      </section>
      <section>
      </section>
      <div className="fixed bottom-5 right-10">
        <form action={create}>
          <Modal
            buttonText="Crear curso"
            confirmButton={{ text: "Crear", type: "submit" }}
          >
            <div>
              <h1 className="text-2xl">Nuevo curso</h1>
              <div className="flex flex-col gap-1 mx-5">
                <TextField
                  id="content"
                  name="content"
                  label="Contenido"
                  required
                />
                <TextField
                  id="topics"
                  name="topics"
                  label="Temas"
                  required
                />
              </div>
            </div>
          </Modal>
        </form>
      </div>
    </>
  );
}
