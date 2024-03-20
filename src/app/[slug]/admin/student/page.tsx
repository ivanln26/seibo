import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import Modal from "@/components/modal";
import Select from "@/components/select";
import Table, { querySchema } from "@/components/table";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { student, studentContact, studentGrade } from "@/db/schema";

export const revalidate = 0;

const contactTypes = [
  { value: "father", description: "Padre" },
  { value: "mother", description: "Madre" },
  { value: "tutor", description: "Tutor" },
  { value: "other", description: "Otro" },
];

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
    where: (grade, { eq }) => eq(grade.schoolId, school.id),
    orderBy: (grade) => grade.id,
  });

  const students = await db.query.student.findMany({
    where: (student, { and, eq, like, or }) =>
      and(
        eq(student.schoolId, school.id),
        queryParams.query !== ""
          ? or(
            like(student.studentCode, `%${queryParams.query}%`),
            like(student.lastName, `%${queryParams.query}%`),
            like(student.firstName, `%${queryParams.query}%`),
          )
          : undefined,
      ),
    orderBy: (student) => student.id,
    limit: queryParams.limit,
    offset: (queryParams.page - 1) * queryParams.limit,
  });

  const create = async (data: FormData) => {
    "use server";
    const studentSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      schoolId: z.number(),
      studentCode: z.string(),
    });
    const contactSchema = z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      type: z.enum(["father", "mother", "tutor", "other"]),
    });
    const gradeId = z.coerce.number();

    const newStudent = studentSchema.safeParse({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      schoolId: school.id,
      studentCode: data.get("studentCode"),
    });
    const newContact = contactSchema.safeParse({
      name: data.get("contactName"),
      email: data.get("contactEmail"),
      phone: data.get("contactPhone"),
      type: data.get("contactType"),
    });
    const newGradeId = gradeId.safeParse(data.get("studentGrade"));

    if (!newStudent.success || !newContact.success || !newGradeId.success) {
      return;
    }

    await db.transaction(async (tx) => {
      await tx.insert(student).values(newStudent.data);

      const savedStudent = await tx.query.student.findFirst({
        where: (student, { eq }) =>
          eq(student.studentCode, newStudent.data.studentCode),
      });

      if (savedStudent === undefined) {
        tx.rollback();
        return;
      }

      await tx.insert(studentContact).values({
        ...newContact.data,
        studentId: savedStudent.id,
      });

      await tx.insert(studentGrade).values({
        studentId: savedStudent.id,
        gradeId: newGradeId.data,
      });
    });

    revalidatePath(`/${params.slug}/admin/student`);
  };
  return (
    <>
      <Table
        title="Estudiantes"
        data={students}
        columns={[
          // { attr: "id", name: "ID" },
          { attr: "studentCode", name: "Legajo" },
          { attr: "lastName", name: "Apellido" },
          { attr: "firstName", name: "Nombre" },
          { attr: "email", name: "Email" },
          {attr: "icon", name: "Editar"}
        ]}
        href={`/${params.slug}/admin/student`}
        detail="id"
        page={queryParams.page}
        limit={queryParams.limit}
      />
      <form className="fixed bottom-5 right-5 md:right-10" action={create}>
        <Modal
          buttonText="Crear"
          confirmButton={{ text: "Guardar", type: "submit" }}
        >
          <div>
            <h1 className="text-2xl">Crear estudiante</h1>
            <TextField
              id="firstName"
              name="firstName"
              label="Nombre"
              required
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Apellido"
              required
            />
            <TextField
              id="email"
              name="email"
              label="E-mail"
              type="email"
              required
            />
            <TextField
              id="studentCode"
              name="studentCode"
              label="Legajo"
              required
            />
            <Select
              id="studentGrade"
              name="studentGrade"
              label="Curso"
              required
              options={grades.map((c) => ({
                value: c.id,
                description: c.name,
                key: c.id,
              }))}
            />
          </div>
          <label htmlFor="" className="text-xl basis-full">
            Padre/Madre/Tutor
          </label>
          <div className="grid grid-cols-2 gap-4 border rounded-lg p-2">
            <TextField
              id="contactName"
              name="contactName"
              label="Nombre y apellido"
              required
            />
            <TextField
              id="contactEmail"
              name="contactEmail"
              label="E-mail"
              required
            />
            <TextField
              id="contactPhone"
              name="contactPhone"
              label="Teléfono"
              required
            />
            <Select
              id="contactType"
              name="contactType"
              label="Tipo"
              options={contactTypes}
            />
          </div>
        </Modal>
      </form>
    </>
  );
}
