import { revalidatePath } from "next/cache";
import { z } from "zod";

import Modal from "@/components/modal";
import Table, { querySchema } from "@/components/table";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { classroom } from "@/db/schema";

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export const revalidate = 0;

export default async function Page({ params, searchParams }: Props) {
  const query = querySchema.parse(searchParams);

  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (!school) return <></>;

  const classrooms = await db.query.classroom.findMany({
    where: (classroom, { eq }) => eq(classroom.schoolId, school.id),
    limit: query.limit,
    offset: (query.page - 1) * query.limit,
  });

  const create = async (formData: FormData) => {
    "use server";
    const classroomType = z.object({
      name: z.string(),
    });
    const newClassroom = classroomType.safeParse({
      name: formData.get("name"),
    });
    if (!newClassroom.success) {
      return;
    }
    await db.insert(classroom).values({
      name: newClassroom.data.name,
      schoolId: school.id,
    });
    revalidatePath("/");
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
        page={query.page}
        limit={query.limit}
      />
      <div className="fixed bottom-5 right-10">
        <form action={create}>
          <Modal
            buttonText="Crear aula"
            confirmButton={{ text: "Crear", type: "submit" }}
          >
            <div>
              <h1 className="text-2xl">Nuevo curso</h1>
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
