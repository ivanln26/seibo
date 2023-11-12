import { db } from "@/db/db";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Home({ params }: Props) {
  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (!school) {
    return <>No se encontró la escuela.</>;
  }

  return (
    <section>
      <h1 className="text-4xl">{school.name}</h1>
    </section>
  );
}
