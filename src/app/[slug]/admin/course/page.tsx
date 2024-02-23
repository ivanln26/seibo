import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import Modal from "@/components/modal";
import Table, { querySchema } from "@/components/table";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { course } from "@/db/schema";

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
  const queryParams = querySchema.parse(searchParams);

  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (school === undefined) redirect("/");

  const courses = await db.query.course.findMany({
    where: (course, { and, eq, like }) =>
      and(
        eq(course.schoolId, school.id),
        queryParams.query !== ""
          ? like(course.name, `%${queryParams.query}%`)
          : undefined,
      ),
    orderBy: (course) => course.id,
    limit: queryParams.limit,
    offset: (queryParams.page - 1) * queryParams.limit,
  });

  const create = async (formData: FormData) => {
    "use server";
    const t = z.object({
      name: z.string(),
      topics: z.string(),
      schoolId: z.number(),
    });
    const res = t.safeParse({
      name: formData.get("name"),
      topics: formData.get("topics"),
      schoolId: school.id,
    });
    if (!res.success) {
      return;
    }
    await db.insert(course).values(res.data);
    revalidatePath(`/${params.slug}/admin/course`);
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
        page={queryParams.page}
        limit={queryParams.limit}
      />
      <form className="fixed bottom-5 right-5 md:right-10" action={create}>
        <Modal
          buttonText="Crear"
          confirmButton={{ text: "Crear", type: "submit" }}
        >
          <div>
            <h1 className="text-2xl">Crear curso</h1>
            <div className="flex flex-col gap-1 mx-5">
              <TextField
                id="name"
                name="name"
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
