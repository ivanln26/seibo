import TextField from "@/components/text-field"
import { db } from "@/db/db"

import Button from "@/components/button";
import { schoolUser, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { redirect } from "next/navigation";

type Props = {
    params: {
        id: number;
    };
};

export default async function Page({ params }: Props) {
    const selectedUser = (await db.select().from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .where(eq(user.id, params.id)))[0]

    async function update(data: FormData) {
        "use server"
        const userType = z.object({
            name: z.string(),
            email: z.string(),
            role: z.enum(["teacher", "tutor", "admin", "principal"]),
            isActive: z.boolean().nullable()
          });
          const res = userType.safeParse({
            name: data.get("name"),
            email: data.get("email"),
            role: data.get("role"),
            isActive: data.get("isActive")
          });
          if (!res.success) {
            console.log(res.error)
            return;
          }
          await db.update(user).set({
            name: res.data.name,
            email: res.data.email,
          }).where(
            eq(user.id, params.id),
          );
          await db.update(schoolUser).set({
            role: res.data.role,
            isActive: res.data.isActive ? res.data.isActive : false
          }).where(eq(schoolUser.userId, params.id))
          redirect("/abm/user");
    }

    return (
        <>
            <h1 className="text-4xl">Editar usuario</h1>
            <div className="bg-primary-100 m-5 p-4 rounded-xl">
                <form action={update} className="flex flex-col gap-5">
                    <TextField
                        defaultValue={selectedUser.user.name}
                        label="Nombre"
                        id="name"
                        name="name"
                    />
                    <TextField
                        defaultValue={selectedUser.user.email}
                        label="email"
                        id="email"
                        name="email"
                    />
                    <label htmlFor="">Rol</label>
                    <select name="role" id="" className="p-3 border rounded" defaultValue={selectedUser.school_user.role}>
                        <option value="teacher">Profesor/a</option>
                        <option value="tutor">Celador/a</option>
                        <option value="principal">Directiva/o</option>
                    </select>
                    <div>
                        <label htmlFor="" className="mr-5">Esta activo</label>
                        <input name="isActive" type="checkbox" defaultChecked={selectedUser.school_user.isActive} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <Button color="tertiary" type="submit">Guardar</Button>
                </form>
            </div>
        </>
    )
}