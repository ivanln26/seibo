import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { getUser } from "../../lecture/utils";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import { schoolUser, user } from "@/db/schema";
import Modal from "@/components/modal";
import TextField from "@/components/text-field";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type Props = {
  params: {
    slug: string;
    id: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    query?: string;
  };
};

export default async function Page({ params, searchParams }: Props) {
  const query = querySchema.parse(searchParams);

  const currentSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });
  if (!currentSchool) return <>Error al obtener el colegio.</>;
  const session = await getServerSession();
  if (!session) return <>Error al obtener la sesión.</>;
  const currentUser = await getUser(session);
  if (!currentUser) return <>Error al obtener el usuario.</>;

  const users = await db
    .select({
      id: schoolUser.id,
      name: user.name,
      email: user.email,
      role: schoolUser.role,
      isActive: sql<string>`if(${schoolUser.isActive}, "Alta", "Baja")`,
    })
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .where(and(
      eq(schoolUser.schoolId, currentSchool.id),
    ));

  async function createUser(data: FormData) {
    "use server"

    const newUser = z.object({
      name: z.string(),
      email: z.string()
    }).safeParse({
      name: data.get("name"),
      email: data.get("email")
    });
    if (!newUser.success) return;
    await db.insert(user).values(newUser.data);
    const userId = await db.query.user.findFirst({
      columns: {
        id: true
      },
      where: (u, {eq}) => eq(u.email, newUser.data.email)
    })

    const newSchoolUser = z.object({
      schoolId: z.number(),
      userId: z.number(),
      role: z.enum(["teacher", "tutor", "principal", "admin"]),
      isActive: z.boolean()
    }).safeParse({
      schoolId: currentSchool?.id,
      userId: userId?.id,
      role: data.get("role"),
      isActive: Boolean(data.get("isActive"))
    })
    if(!newSchoolUser.success){
      console.log(newSchoolUser.error);
      return;}
    await db.insert(schoolUser).values(newSchoolUser.data)
    revalidatePath(`/${params.slug}/admin/user`)
  }

  return (
    <>
      <Table
        title="Usuarios"
        data={users}
        columns={[
          { attr: "id", name: "ID" },
          { attr: "name", name: "Nombre" },
          { attr: "email", name: "Email" },
          { attr: "role", name: "Rol" },
          { attr: "isActive", name: "Estado" },
        ]}
        href={`/${params.slug}/admin/user`}
        detail="id"
        page={query.page}
        limit={query.limit}
      />
      <form action={createUser} className="fixed bottom-10 right-10">
        <Modal
          buttonText="Crear"
          confirmButton={{ text: "Guardar", type: "submit" }}
        >
          <TextField
            label="Nombre y apellido"
            id="name"
            name="name"
          />
          <TextField
            label="email"
            id="email"
            name="email"
          />
          <label htmlFor="">Rol</label>
          <select
            name="role"
            id=""
            className="p-3 border rounded"
          >
            <option value="teacher">Profesor/a</option>
            <option value="tutor">Celador/a</option>
            <option value="principal">Directiva/o</option>
          </select>
          <div>
            <label htmlFor="" className="mr-5">Esta activo</label>
            <input
              name="isActive"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </Modal>
      </form>
    </>
  );
}
