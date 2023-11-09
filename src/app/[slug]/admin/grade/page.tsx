import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { z } from "zod";

import { getUser } from "../../lecture/utils";
import Modal from "@/components/modal";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { grade } from "@/db/schema";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const session = await getServerSession();
  if (!session) return <>Error al obtener la sesión.</>;

  const user = await getUser(session);
  if (!user) return <>Error al obtener el usuario.</>;

  const actualSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });
  if (!actualSchool) return <>Error al obtener el usuario.</>;

  const grades = await db.select()
    .from(grade)
    .where(and(
      eq(grade.schoolId, actualSchool.id),
    ));

  async function createSchedule(data: FormData) {
    "use server";
    const gradeType = z.object({
      name: z.string(),
      schoolId: z.number(),
    });
    const newGrade = gradeType.safeParse({
      name: data.get("name"),
      schoolId: Number(data.get("schoolId")),
    });
    if (!newGrade.success) {
      return;
    }

    await db.insert(grade).values({
      name: newGrade.data.name,
      schoolId: newGrade.data.schoolId,
    });
    revalidatePath(`${params.slug}/admin/grade`);
  }

  return (
    <section className="flex flex-col gap-5 ml-2">
      <h1 className="text-4xl">Cursos</h1>
      <div className="w-full">
        <table className="w-full">
          <tbody>
            <tr className="bg-primary-100">
              <td className="border border-black">Curso</td>
            </tr>
            {grades.map((s) => (
              <tr>
                <td className="border border-black">
                  <Link href={`/${params.slug}/admin/grade/${s.id}`}>
                    {s.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fixed bottom-5 right-10">
        <form action={createSchedule}>
          <Modal
            buttonText="Crear"
            confirmButton={{ text: "Guardar", type: "submit" }}
          >
            <h1 className="text-2xl">Crear horario</h1>
            <div>
              <input type="hidden" value={actualSchool.id} name="schoolId" />
              <TextField id="name" name="name" label="Nombre"></TextField>
            </div>
          </Modal>
        </form>
      </div>
    </section>
  );
}
