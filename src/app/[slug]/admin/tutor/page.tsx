import { and, eq, sql } from "drizzle-orm";

import Table, { querySchema } from "@/components/table";
import { db } from "@/db/db";
import { gradeTutor, school, schoolUser, user } from "@/db/schema";

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
  const query = querySchema.parse(searchParams);

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
    ));

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
        page={query.page}
        limit={query.limit}
      />
    </>
  );
}
