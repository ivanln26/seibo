import TextField from "@/components/text-field";
import { db } from "@/db/db";

import Button from "@/components/button";
import { schoolUser, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { redirect } from "next/navigation";
import Checkbox from "@/components/checkbox";

type Props = {
  params: {
    slug: string;
    id: number;
  };
};

export default async function Page({ params }: Props) {
  const selectedUser = (await db.select().from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .where(eq(schoolUser.id, params.id)))[0];

  async function update(data: FormData) {
    "use server";
    const userType = z.object({
      name: z.string(),
      email: z.string(),
      role: z.enum(["teacher", "tutor", "admin", "principal"]),
      isActive: z.boolean().nullable(),
    });
    const res = userType.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      role: data.get("role"),
      isActive: data.get("isActive") === "on" ? true : false,
    });
    if (!res.success) {
      return;
    }
    await db.update(user).set({
      name: res.data.name,
      email: res.data.email,
    }).where(
      eq(user.id, selectedUser.user.id),
    );
    await db.update(schoolUser).set({
      role: res.data.role,
      isActive: res.data.isActive ? res.data.isActive : false,
    }).where(eq(schoolUser.id, params.id));
    redirect(`${params.slug}/admin/user`);
  }

  return (
    <>
      <h1 className="text-4xl">Editar usuario</h1>
      <div className="bg-primary-100 m-5 p-4 rounded-xl">
        <form action={update} className="flex flex-col gap-5">
          <TextField
            defaultValue={selectedUser.user.name}
            label="Nombre y apellido"
            id="name"
            name="name"
          />
          <TextField
            defaultValue={selectedUser.user.email}
            label="email"
            id="email"
            name="email"
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="">Rol</label>
            <select
              name="role"
              id=""
              className="p-4 bg-transparent outline outline-1 outline-outline rounded"
            >
              <option value="teacher">Profesor/a</option>
              <option value="tutor">Celador/a</option>
              <option value="principal">Directiva/o</option>
            </select>
          </div>
          <div className="flex">
            <label htmlFor="" className="mr-5">Esta activo</label>
            <Checkbox
              checked={selectedUser.school_user.isActive}
              id="active"
              name="isActive"
            />
          </div>
          <div>
            <Button color="tertiary" type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </>
  );
}
