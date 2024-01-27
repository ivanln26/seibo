import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { grade, school } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/grade`);
  }

  const query = await db
    .select({
      id: grade.id,
      schoolId: grade.schoolId,
      name: grade.name,
    })
    .from(grade)
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(
      and(
        eq(school.slug, params.slug),
        eq(grade.id, Number(params.id)),
      ),
    );

  if (query.length !== 1) {
    redirect(`/${params.slug}/admin/grade`);
  }

  return (
    <>
      <h1 className="text-4xl">Modificar curso</h1>
      <Form slug={params.slug} grade={query[0]} />
    </>
  );
}
