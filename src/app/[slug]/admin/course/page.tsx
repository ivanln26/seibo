import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import Modal from "@/components/modal";
import TextField from "@/components/text-field";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import { course, school } from "@/db/schema";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    query?: string;
  };
};

export default async function Page({ params, searchParams }: Props) {
  const query = querySchema.parse(searchParams);

  const courses = await db
    .select({
      id: course.id,
      name: course.name,
      topics: course.topics,
    })
    .from(course)
    .innerJoin(school, eq(course.schoolId, school.id))
    .where(eq(school.slug, params.slug));

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
      <Table
        title="Materias"
        data={courses}
        columns={[
          { attr: "id", name: "ID" },
          { attr: "name", name: "Nombre" },
          { attr: "topics", name: "Temas" },
        ]}
        href={`/${params.slug}/admin/course`}
        detail="id"
        page={query.page}
        limit={query.limit}
      />
      <form className="fixed bottom-5 right-10" action={create}>
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
    </>
  );
}
