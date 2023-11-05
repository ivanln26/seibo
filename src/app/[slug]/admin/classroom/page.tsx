import { revalidatePath } from "next/cache";
import Link from "next/link";
import { z } from "zod";

import TextField from "@/components/text-field";
import Modal from "@/components/modal";
import { db } from "@/db/db";
import { classroom } from "@/db/schema";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 0;

export default async function Page({ params }: Props) {
  const actualSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (!actualSchool) return <></>;

  const classrooms = await db.query.classroom.findMany({
    where: (classroom, { eq }) => eq(classroom.schoolId, actualSchool.id),
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
      schoolId: actualSchool.id,
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
            <tr className="py-1 text-primary-900 border border-neutral-variant-50 bg-primary-100 dark:text-primary-100 dark:border-neutral-variant-60 dark:bg-primary-700">
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((cr, i) => (
              <tr key={i}>
                <td
                  key={i}
                  className="text-center border border-neutral-variant-50 dark:border-neutral-variant-60"
                >
                  <Link href={`/${params.slug}/admin/classroom/${cr.id}`}>
                    {cr.name}
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
