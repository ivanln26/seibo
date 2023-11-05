import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { getUser } from "../../lecture/utils";
import { db } from "@/db/db";
import { schoolUser, user } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const currentSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });
  if (!currentSchool) return <>Error al obtener el colegio.</>;
  const session = await getServerSession();
  if (!session) return <>Error al obtener la sesión.</>;
  const currentUser = await getUser(session);
  if (!currentUser) return <>Error al obtener el usuario.</>;

  const users = await db.select()
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .where(and(
      eq(schoolUser.schoolId, currentSchool.id),
    ));

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
            {users.map((u) => (
              <tr>
                <td className="border border-black">
                  <Link href={`/${params.slug}/userABM/${u.user.id}`}>
                    {u.user.name}
                  </Link>
                </td>
                <td className="border border-black">
                  <Link href={`/${params.slug}/userABM/${u.user.id}`}>
                    {u.user.email}
                  </Link>
                </td>
                <td className="border border-black">
                  <Link href={`/${params.slug}/userABM/${u.user.id}`}>
                    {u.school_user.role}
                  </Link>
                </td>
                <td className="border border-black">
                  <Link href={`/${params.slug}/userABM/${u.user.id}`}>
                    {u.school_user.isActive ? "alta" : "baja"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fixed bottom-5 right-10">
      </div>
    </section>
  );
}
