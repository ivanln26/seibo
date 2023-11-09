import { revalidatePath } from "next/cache";
import { z } from "zod";

import TextField from "@/components/text-field";
import Modal from "@/components/modal";
import { db } from "@/db/db";
import { course } from "@/db/schema";
import Link from "next/link";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const courses = await db.select().from(course);

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
        <h1 className="text-4xl">Courses</h1>
      </section>
      <section>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              {["Nombre", "Temas"].map((c) => (
                <th className="py-1 text-primary-900 border border-neutral-variant-50 bg-primary-100 dark:text-primary-100 dark:border-neutral-variant-60 dark:bg-primary-700">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr>
                <td className="text-center border border-neutral-variant-50 dark:border-neutral-variant-60">
                  <Link href={`/${params.slug}/admin/course/${c.id}`}>
                    {c.name}
                  </Link>
                </td>
                <td className="text-center border border-neutral-variant-50 dark:border-neutral-variant-60">
                  <Link href={`/${params.slug}/admin/course/${c.id}`}>
                    {c.topics}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
