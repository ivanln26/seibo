import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import Button from "@/components/button";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { grade, student, studentContact, studentGrade } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: number;
  };
};

export default async function Page({ params }: Props) {
  const currentSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });
  if (!currentSchool) return <>Error al obtener la institución.</>;
  const currentStudent = (
    await db.select()
      .from(student)
      .innerJoin(studentContact, eq(student.id, studentContact.studentId))
      .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
      .where(eq(student.id, params.id))
  )[0];
  if (!currentStudent) redirect("/");

  const grades = await db.select()
    .from(grade)
    .where(eq(grade.schoolId, currentSchool.id));

  const update = async (data: FormData) => {
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
      schoolId: currentSchool.id,
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

    await db.update(student).set({ ...newStudent.data })
      .where(eq(student.id, Number(params.id)));

    await db.update(studentContact).set({
      ...newContact.data,
      studentId: Number(params.id),
    }).where(
      eq(studentContact.id, currentStudent.student_contact.id),
    );

    await db.update(studentGrade).set({
      studentId: Number(params.id),
      gradeId: newGradeId.data.id,
    }).where(
      eq(studentGrade.id, currentStudent.student_grade.id),
    );
    redirect(`/${params.slug}/admin/student`);
  };

  const del = async () => {
    "use server";
    await db.delete(student).where(
      eq(student.id, Number(params.id)),
    );

    await db.delete(studentContact).where(
      eq(studentContact.id, currentStudent.student_contact.id),
    );

    await db.delete(studentGrade).where(
      eq(studentGrade.id, currentStudent.student_grade.id),
    );
    redirect(`/${params.slug}/admin/student`);
  };

  return (
    <section>
      <h1 className="text-4xl ml-5">Modificar alumno</h1>
      <div className="bg-primary-100 flex flex-col gap-5 m-5 p-4 rounded-xl">
        <form action={update}>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              id=""
              name="studentFirstName"
              label="Nombre"
              defaultValue={currentStudent.student.firstName}
              required
            />
            <TextField
              id=""
              name="studentLastName"
              label="Apellido"
              defaultValue={currentStudent.student.lastName}
              required
            />
            <TextField
              id=""
              name="studentEmail"
              label="E-mail"
              defaultValue={currentStudent.student.email}
              required
            />
            <TextField
              id=""
              name="studentCode"
              label="Legajo"
              defaultValue={currentStudent.student.studentCode}
              required
            />
            <div className="flex-none basis-1/2 grow w-full">
              <label htmlFor="" className="mt-4">Curso*</label>
              <select
                name="studentGrade"
                defaultValue={currentStudent.student_grade.gradeId}
                className="outline outline-1 outline-outline rounded p-4 w-full bg-transparent"
              >
                <option value="">----</option>
                {grades.map((c) => (
                  <option value={Number(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <label htmlFor="" className="text-xl basis-full">
            Padre/Madre/Tutor
          </label>
          <input
            type="hidden"
            name="studentSchool"
            value={1 /* Cambiar por colegio */}
          />
          <div className="grid grid-cols-2 gap-4 rounded-lg p-2">
            <TextField
              label="Nombre y apellido"
              name="contactName"
              id=""
              defaultValue={currentStudent.student_contact.name}
            />
            <TextField
              label="E-mail"
              name="contactEmail"
              id=""
              defaultValue={currentStudent.student_contact.email}
            />
            <TextField
              label="telefono"
              name="contactPhone"
              id=""
              defaultValue={currentStudent.student_contact.phone}
            />
            <div className="flex flex-col justify-center">
              <label htmlFor="">Tipo</label>
              <select
                name="contactType"
                id=""
                defaultValue={currentStudent.student_contact.type}
                className=" outline outline-1 outline-outline rounded p-4 w-full bg-transparent"
              >
                <option value="-">---</option>
                <option value="father">Padre</option>
                <option value="mother">Madre</option>
                <option value="tutor">Tutor</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
          <Button color="tertiary" type="submit">Guardar</Button>
        </form>
        <form action={del} className="relative -top-[60px] left-28">
          <Button color="error" type="submit">Borrar</Button>
        </form>
      </div>
    </section>
  );
}
