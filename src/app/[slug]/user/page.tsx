import { eq } from "drizzle-orm";

import LogOutButton from "./logout-button";
import { db } from "@/db/db";
import { course, instance, user } from "@/db/schema";
import type { Role } from "@/db/schema";
import { getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

const translation: Record<Role, string> = {
  admin: "Administrador",
  principal: "Director",
  teacher: "Profesor",
  tutor: "Preceptor",
};

export default async function Page({ params }: Props) {
  const userProfile = await getUserProfile({ slug: params.slug });
  const school = await db.query.school.findFirst({
    columns: { name: true },
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (!school) {
    return <>Error al obtener la escuela de la base de datos.</>;
  }

  const courses = await db
    .selectDistinct({
      id: course.id,
      name: course.name,
    })
    .from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .where(eq(user.id, userProfile.id));

  return (
    <div className="flex flex-col md:flex-row gap-x-6 gap-y-4">
      <section className="flex flex-col gap-y-3 p-4 rounded outline outline-1 md:outline-0 outline-outline">
        <h1 className="text-4xl font-bold">{userProfile.name}</h1>
        <h2 className="text-lg">{userProfile.email}</h2>
        <LogOutButton />
      </section>
      <section className="flex flex-col gap-y-2 p-4 rounded outline outline-1 md:outline-0 outline-outline">
        <h2 className="text-4xl font-bold">{school.name}</h2>
        <h1 className="text-2xl">Roles</h1>
        <ul className="list-disc list-inside text-lg">
          {userProfile.profiles.map((p, i) => (
            <li className="ml-4" key={i}>{translation[p.role]}</li>
          ))}
        </ul>
        <h1 className="text-2xl">Materias</h1>
        <ul className="list-disc list-inside text-lg">
          {courses.map(({ name }, i) => (
            <li className="ml-4" key={i}>
              {name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
