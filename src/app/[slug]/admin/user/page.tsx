import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { getUser } from "../../lecture/utils";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import { schoolUser, user } from "@/db/schema";

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

  return (
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
  );
}
