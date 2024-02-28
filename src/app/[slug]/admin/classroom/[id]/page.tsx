import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { classroom, school } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/classroom`);
  }

  const query = await db
    .select({
      id: classroom.id,
      name: classroom.name,
    })
    .from(classroom)
    .innerJoin(school, eq(classroom.schoolId, school.id))
    .where(and(
      eq(school.slug, params.slug),
      eq(classroom.id, Number(params.id)),
    ));

  if (query.length !== 1) {
    redirect(`/${params.slug}/admin/classroom`);
  }

  const audits = await db.query.audit.findMany({
    columns: { id: true, delta: true, createdAt: true },
    where: (audit, { and, eq, like }) =>
      and(
        like(audit.table, "classroom"),
        eq(audit.pk, Number(params.id)),
      ),
    orderBy: (audit, { desc }) => desc(audit.id),
  });

  return (
    <>
      <h1 className="text-4xl">Modificar aula</h1>
      <Form
        slug={params.slug}
        classroom={query[0]}
      />
      {audits.length > 0 && (
        <details className="pt-4">
          <summary className="text-2xl">Auditoría</summary>
          <ul className="list-disc list-inside">
            {audits.map(({ id, delta, createdAt }) => (
              <li key={id}>
                {"name" in delta && delta["name"]} -{" "}
                {createdAt.toLocaleString()}
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
