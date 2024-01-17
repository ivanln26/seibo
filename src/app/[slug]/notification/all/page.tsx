import { redirect } from "next/navigation";

import Form from "./form";
import { getUserProfile } from "@/db/queries";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });

  if (
    user.profiles.filter((p) => p.role === "admin" || p.role === "principal")
      .length === 0
  ) {
    redirect(`/${params.slug}/notification`);
  }

  return <Form />;
}
