import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { z } from "zod";

import { getUser } from "../lecture/utils";
import Modal from "@/components/modal";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { grade, student, studentContact, studentGrade } from "@/db/schema";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const currentSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });
  if (!currentSchool) return <>Error al obtener la institución.</>;
  const session = await getServerSession();
  if (!session) return <>Error al obtener la sesión.</>;
  const currentUser = await getUser(session);
  if (!currentUser) return <>Error al obtener el usuario.</>;

  const grades = await db.select()
    .from(grade)
    .where(eq(grade.schoolId, currentSchool.id));

  const users = await db.select()
    .from(student)
    .where(eq(student.schoolId, currentSchool.id));

  async function create(data: FormData) {
    "use server";
    const studentType = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      schoolId: z.number(),
      studentCode: z.string(),
    });
    const contactType = z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      type: z.enum(["father", "mother", "tutor", "other"]),
    });

    const gradeiDType = z.object({ id: z.number() });

    const newStudent = studentType.safeParse({
      firstName: data.get("studentFirstName"),
      lastName: data.get("studentLastName"),
      email: data.get("studentEmail"),
      schoolId: 1, // TODO change
      studentCode: data.get("studentCode"),
    });
    const newContact = contactType.safeParse({
      name: data.get("contactName"),
      email: data.get("contactEmail"),
      phone: data.get("contactPhone"),
      type: data.get("contactType"),
    });

    const newGradeId = gradeiDType.safeParse({
      id: Number(data.get("studentGrade")),
    });

    if (!newStudent.success || !newContact.success || !newGradeId.success) {
      return;
    }

    await db.insert(student).values(newStudent.data);
    const savedStudent = await db.select().from(student).where(
      eq(student.email, newStudent.data.email),
    );

    await db.insert(studentContact).values({
      ...newContact.data,
      studentId: savedStudent[0].id,
    });

    await db.insert(studentGrade).values({
      studentId: savedStudent[0].id,
      gradeId: newGradeId.data.id,
    });

    revalidatePath(`/${params.slug}/student`);
  }
  return (
    <section className="flex flex-col gap-5 ml-2">
      <h1 className="text-4xl">Estudiantes</h1>
      <div className="w-full">
        <table className="w-full">
          <tbody>
            <tr className="bg-primary-100">
              <td className="border border-black">Nombre y apellido</td>
              <td className="border border-black">email</td>
              <td className="border border-black">Legajo</td>
            </tr>
            {users.map((u) => (
              <tr>
                <td className="border border-black">
                  <Link href={`/${params.slug}/student/${u.id}`}>
                    {u.firstName} {u.lastName}
                  </Link>
                </td>
                <td className="border border-black">
                  <Link href={`/${params.slug}/student/${u.id}`}>
                    {u.email}
                  </Link>
                </td>
                <td className="border border-black">
                  <Link href={`/${params.slug}/student/${u.id}`}>
                    {u.studentCode}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fixed bottom-5 right-10">
        <form action={create}>
          <Modal
            buttonText="Crear"
            confirmButton={{ text: "Guardar", type: "submit" }}
          >
            <div className="grid grid-cols-2 gap-4">
              <TextField
                id=""
                name="studentFirstName"
                label="Nombre"
                required
              />
              <TextField
                id=""
                name="studentLastName"
                label="Apellido"
                required
              />
              <TextField id="" name="studentEmail" label="E-mail" required />
              <TextField id="" name="studentCode" label="Legajo" required />
              <div className="flex-none basis-1/2 grow w-full">
                <label htmlFor="" className="mt-4">Curso*</label>
                <select
                  name="studentGrade"
                  className=" outline outline-1 outline-outline rounded p-4 w-full"
                >
                  <option value="">----</option>
                  {grades.map((c) => <option value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <label htmlFor="" className="text-xl basis-full">
              Padre/Madre/Tutor
            </label>
            <input
              type="hidden"
              name="studentSchool"
              value={1} // TODO: Cambiar por colegio
            />
            <div className="grid grid-cols-2 gap-4 border rounded-lg p-2">
              <TextField label="Nombre y apellido" name="contactName" id="" />
              <TextField label="E-mail" name="contactEmail" id="" />
              <TextField label="telefono" name="contactPhone" id="" />
              <div className="flex flex-col justify-center">
                <label htmlFor="">Tipo</label>
                <select
                  name="contactType"
                  id=""
                  className=" outline outline-1 outline-outline rounded p-4 w-full"
                >
                  <option value="-">---</option>
                  <option value="father">Padre</option>
                  <option value="mother">Madre</option>
                  <option value="tutor">Tutor</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>
          </Modal>
        </form>
      </div>
    </section>
  );
}
