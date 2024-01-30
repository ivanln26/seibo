import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { course, school } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export const revalidate = 0;

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/course`);
  }

  const query = await db
    .select()
    .from(course)
    .innerJoin(school, eq(course.schoolId, school.id))
    .where(
      and(
        eq(school.slug, params.slug),
        eq(course.id, Number(params.id)),
      ),
    );

  if (query.length !== 1) {
    redirect(`/${params.slug}/admin/course`);
  }

  return (
    <>
      <h1 className="text-4xl">Modificar materia</h1>
      <Form slug={params.slug} course={query[0].course} />
    </>
  );
}
