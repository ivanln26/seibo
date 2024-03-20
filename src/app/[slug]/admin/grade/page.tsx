import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import Modal from "@/components/modal";
import Table, { querySchema } from "@/components/table";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { grade } from "@/db/schema";

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

  const grades = await db.query.grade.findMany({
    where: (grade, { and, eq, like }) =>
      and(
        eq(grade.schoolId, school.id),
        queryParams.query !== ""
          ? like(grade.name, `%${queryParams.query}%`)
          : undefined,
      ),
    orderBy: (grade) => grade.id,
    limit: queryParams.limit,
    offset: (queryParams.page - 1) * queryParams.limit,
  });

  const create = async (data: FormData) => {
    "use server";
    const gradeSchema = z.object({
      name: z.string(),
      schoolId: z.number(),
    });

    const newGrade = gradeSchema.safeParse({
      name: data.get("name"),
      schoolId: school.id,
    });

    if (!newGrade.success) {
      return;
    }

    await db.insert(grade).values(newGrade.data);
    revalidatePath(`${params.slug}/admin/grade`);
  };

  return (
    <>
      <Table
        title="Cursos"
        data={grades}
        columns={[
          // { attr: "id", name: "ID" },
          { attr: "name", name: "Nombre" },
          {attr: "icon", name: "Editar"}
        ]}
        href={`/${params.slug}/admin/grade`}
        detail="id"
        page={queryParams.page}
        limit={queryParams.limit}
      />
      <form
        className="fixed bottom-5 right-5 md:right-10"
        action={create}
      >
        <Modal
          buttonText="Crear"
          confirmButton={{ text: "Guardar", type: "submit" }}
        >
          <h1 className="text-2xl">Crear curso</h1>
          <div>
            <TextField id="name" name="name" label="Nombre" required />
          </div>
        </Modal>
      </form>
    </>
  );
}
