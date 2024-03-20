import { and, eq, like, or, sql } from "drizzle-orm";
import Link from "next/link";

import Button from "@/components/button";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import { school, schoolUser, user } from "@/db/schema";

export const revalidate = 0;

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
    .innerJoin(school, eq(schoolUser.schoolId, school.id))
    .where(and(
      eq(school.slug, params.slug),
      query.query
        ? or(
          like(user.name, `%${query.query}%`),
          like(user.email, `%${query.query}%`),
        )
        : undefined,
    ))
    .orderBy(schoolUser.id);

  return (
    <>
      <Table
        title="Usuarios"
        data={users}
        columns={[
          // { attr: "id", name: "ID" },
          { attr: "name", name: "Nombre" },
          { attr: "email", name: "Email" },
          { attr: "role", name: "Rol" },
          { attr: "isActive", name: "Estado" },
          {attr: "icon", name: "Editar"}
        ]}
        href={`/${params.slug}/admin/user`}
        detail="id"
        page={query.page}
        limit={query.limit}
      />
      <div className="fixed bottom-5 right-5 md:right-10">
        <Button color="tertiary">
          <Link href={`/${params.slug}/admin/new/user`}>Crear</Link>
        </Button>
      </div>
    </>
  );
}
