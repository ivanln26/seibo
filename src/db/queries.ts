import { and, eq, gt, like, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { db } from "./db";
import { school, schoolUser, user } from "./schema";
import type { Role, SchoolUser, User } from "./schema";

export type UserProfile = User & { profiles: SchoolUser[] };

/**
 * Server-side
 */
export async function getUserProfile(
  { slug }: { slug: string },
): Promise<UserProfile> {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Error al obtener la sesión del usuario.");
  }

  const profiles = await db
    .select({ user, schoolUser, school })
    .from(user)
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .innerJoin(school, eq(schoolUser.schoolId, school.id))
    .where(and(
      like(user.email, session.user.email),
      like(school.slug, slug),
      eq(schoolUser.isActive, true),
    ));

  if (profiles.length === 0) {
    throw new Error("No se pudo obtener ningún perfil.");
  }

  return profiles.reduce<UserProfile>((u, row) => {
    u.profiles.push(row.schoolUser);
    return u;
  }, {
    ...profiles[0].user,
    profiles: [],
  });
}

export async function hasRoles(
  user: UserProfile,
  strategy: "OR" | "AND",
  ...roles: Role[]
): Promise<boolean> {
  const intersection = user.profiles.filter(({ role }) => roles.includes(role));
  return strategy === "OR"
    ? intersection.length > 0
    : intersection.length === roles.length;
}

export async function getUserSchools() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Error al obtener la sesión del usuario.");
  }

  return await db
    .select({
      id: school.id,
      name: school.name,
      slug: school.slug,
      count: sql<number>`count(${school.id})`,
    })
    .from(school)
    .innerJoin(schoolUser, eq(school.id, schoolUser.schoolId))
    .innerJoin(user, eq(schoolUser.userId, user.id))
    .where(and(
      eq(user.email, session.user.email),
      eq(schoolUser.isActive, true),
    ))
    .groupBy(({ id }) => id)
    .having(({ count }) => gt(count, 0));
}

/**
 * Server-side
 */
export async function getSchool({ slug }: { slug: string }) {
  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, slug),
  });
  if (school === undefined) {
    throw new Error("Error al obtener la escuela por slug.");
  }
  return school;
}
