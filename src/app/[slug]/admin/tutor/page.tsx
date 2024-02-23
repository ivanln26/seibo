import { and, eq, like, sql } from "drizzle-orm";
import Link from "next/link";

import Button from "@/components/button";
import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import { gradeTutor, school, schoolUser, user } from "@/db/schema";

export const revalidate = 0;

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

  const tutors = await db
    .selectDistinct({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: sql<string>`if(${schoolUser.isActive}, "Alta", "Baja")`,
    })
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .innerJoin(school, eq(schoolUser.schoolId, school.id))
    .leftJoin(gradeTutor, eq(user.id, gradeTutor.tutorId))
    .where(and(
      eq(school.slug, params.slug),
      eq(schoolUser.role, "tutor"),
      queryParams.query !== ""
        ? like(user.name, `%${queryParams.query}%`)
        : undefined,
    ))
    .orderBy(user.id)
    .limit(queryParams.limit)
    .offset((queryParams.page - 1) * queryParams.limit);

  return (
    <>
      <Table
        title="Preceptores"
        data={tutors}
        columns={[
          { attr: "id", name: "ID" },
          { attr: "name", name: "Nombre" },
          { attr: "email", name: "Email" },
          { attr: "isActive", name: "Estado" },
        ]}
        href={`/${params.slug}/admin/tutor`}
        detail="id"
        page={queryParams.page}
        limit={queryParams.limit}
      />
      <div className="fixed bottom-5 right-5 md:right-10">
        <Button color="tertiary">
          <Link
            href={{
              pathname: `/${params.slug}/admin/new/user`,
              query: { isTutor: true },
            }}
          >
            Crear
          </Link>
        </Button>
      </div>
    </>
  );
}
