import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";
import { school, schoolUser, user } from "@/db/schema";

type Props = {
  params: {
    slug: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (isNaN(Number(params.id))) {
    redirect(`/${params.slug}/admin/user`);
  }

  const query = await db
    .select({
      id: schoolUser.id,
      name: user.name,
      email: user.email,
      role: schoolUser.role,
      isActive: schoolUser.isActive,
    })
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .innerJoin(school, eq(schoolUser.schoolId, school.id))
    .where(
      and(
        eq(school.slug, params.slug),
        eq(schoolUser.id, Number(params.id)),
      ),
    );

  if (query.length !== 1) {
    redirect(`/${params.slug}/admin/user`);
  }

  return (
    <>
      <h1 className="text-4xl">Modificar usuario</h1>
      <Form slug={params.slug} user={query[0]} />
    </>
  );
}
