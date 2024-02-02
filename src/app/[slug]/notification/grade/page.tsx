import { db } from "@/db/db";
import { grade } from "@/db/schema";
import { getUserProfile } from "@/db/queries";

import Form from "./form";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const grades = await db.select().from(grade);

  return <Form user={user} slug={params.slug} grades={grades} />;
}
