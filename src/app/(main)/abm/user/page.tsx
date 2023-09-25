import { db } from "@/db/db";
import { course, grade, instance, schedule, schoolUser, user as User } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { getUser } from "../../lecture/utils";
import Modal from "@/components/modal";
import Link from "next/link";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export default async function Page() {
    const session = await getServerSession();
    if (!session) return (<>Error al obtener la sesión.</>)
    const user = await getUser(session);
    if (!user) return <>Error al obtener el usuario.</>
    const users = await db.select()
        .from(User)
        .innerJoin(schoolUser, eq(User.id, schoolUser.userId))
        .where(and(
            eq(schoolUser.schoolId, 1) // getear mediante el slug
        ))

    return (
        <section className="flex flex-col gap-5 ml-2">
            <h1 className="text-4xl">Usuarios</h1>
            <div className="w-full">
                <table className="w-full">
                    <tbody>
                        <tr className="bg-primary-100">
                            <td className="border border-black">Nombre y apellido</td>
                            <td className="border border-black">email</td>
                            <td className="border border-black">Rol</td>
                            <td className="border border-black">Estado</td>
                        </tr>
                        {users.map((u) => <tr>
                            <td className="border border-black"><Link href={`/schedule/${u.user.id}`}>{u.user.name}</Link></td>
                            <td className="border border-black"><Link href={`/schedule/${u.user.id}`}>{u.user.email}</Link></td>
                            <td className="border border-black"><Link href={`/schedule/${u.user.id}`}>{u.school_user.role}</Link></td>
                            <td className="border border-black"><Link href={`/schedule/${u.user.id}`}>{u.school_user.isActive ? "alta" : "baja"}</Link></td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div className="fixed bottom-5 right-10">
            </div>
        </section>
    );
}