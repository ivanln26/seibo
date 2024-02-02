import { redirect } from "next/navigation";

import Form from "./form";
import { getUserProfile, hasRoles } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const isAdminOrPrincipal = await hasRoles(user, "OR", "admin", "principal");

  if (!isAdminOrPrincipal) {
    redirect(`/${params.slug}/notification`);
  }

  return <Form user={user} slug={params.slug} />;
}
