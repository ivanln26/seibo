import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import Modal from "@/components/modal";
import Table, { querySchema } from "@/components/table";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { classroom } from "@/db/schema";

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

  const classrooms = await db.query.classroom.findMany({
    where: (classroom, { and, eq, like }) =>
      and(
        eq(classroom.schoolId, school.id),
        queryParams.query !== ""
          ? like(classroom.name, `%${queryParams.query}%`)
          : undefined,
      ),
    orderBy: (classroom) => classroom.id,
    limit: queryParams.limit,
    offset: (queryParams.page - 1) * queryParams.limit,
  });

  const create = async (formData: FormData) => {
    "use server";
    const classroomSchema = z.object({
      name: z.string(),
      schoolId: z.number(),
    });

    const newClassroom = classroomSchema.safeParse({
      name: formData.get("name"),
      schoolId: school.id,
    });

    if (!newClassroom.success) {
      return;
    }

    await db.insert(classroom).values(newClassroom.data);
    revalidatePath(`/${params.slug}/admin/classroom`);
  };

  return (
    <>
      <Table
        title="Aulas"
        data={classrooms}
        columns={[
          { attr: "id", name: "ID" },
          { attr: "name", name: "Nombre" },
        ]}
        href={`/${params.slug}/admin/classroom`}
        detail="id"
        page={queryParams.page}
        limit={queryParams.limit}
      />
      <div className="fixed bottom-5 right-5 md:right-10">
        <form action={create}>
          <Modal
            buttonText="Crear"
            confirmButton={{ text: "Crear", type: "submit" }}
          >
            <div>
              <h1 className="text-2xl">Crear aula</h1>
              <div className="flex flex-col gap-1 mx-5">
                <TextField
                  id="name"
                  name="name"
                  label="Nombre"
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
