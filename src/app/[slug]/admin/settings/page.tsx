import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { school } from "@/db/schema";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const query = await db
    .select()
    .from(school)
    .where(eq(school.slug, params.slug));

  if (query.length !== 1) {
    redirect(`/${params.slug}/admin`);
  }

  return (
    <>
      <h1 className="text-4xl">Modificar configuración</h1>
      <Form slug={params.slug} school={query[0]} />
    </>
  );
}
