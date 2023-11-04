import { getServerSession } from "next-auth";

import { db } from "./db";

/**
 * Server-side
 */
export async function getUserProfile({ slug }: { slug: string }) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Error al obtener la sesión del usuario.");
  }

  const school = await db.query.school.findFirst({
    columns: { id: true },
    where: (school, { eq }) => eq(school.slug, slug),
  });

  if (!school) {
    throw new Error("Error al obtener la escuela de la base de datos.");
  }

  const u = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, session.user.email),
    with: {
      profiles: {
        columns: { role: true },
        where: (profile, { and, eq }) =>
          and(
            eq(profile.isActive, true),
            eq(profile.schoolId, school.id),
          ),
      },
    },
  });

  if (!u) {
    throw new Error("Error al obtener el usuario de la base de datos.");
  }

  return u;
}
