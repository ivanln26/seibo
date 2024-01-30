import { redirect } from "next/navigation";

import Form from "./form";
import { db } from "@/db/db";

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

  const currentClassroom = await db.query.classroom.findFirst({
    where: (classroom, { eq }) => eq(classroom.id, Number(params.id)),
  });

  if (!currentClassroom) {
    redirect(`/${params.slug}/admin/classroom`);
  }

  return (
    <>
      <h1 className="text-4xl">Modificar aula</h1>
      <Form
        slug={params.slug}
        classroom={{ id: Number(params.id), name: currentClassroom.name }}
      />
    </>
  );
}
