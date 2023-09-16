import { getServerSession } from "next-auth";

import { db } from "@/db/db";

export const revalidate = 0;

export default async function Page() {
  const session = await getServerSession();

  if (!session) {
    return <>Error al obtener la sesión.</>;
  }

  const u = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, session.user.email),
    with: {
      profiles: { where: (profile, { eq }) => eq(profile.isActive, true) },
    },
  });

  if (!u) {
    return <>Error al obtener el usuario de la base de datos.</>;
  }

  return (
    <>
      <h1>Usuario</h1>
      <h2>Email: {session?.user?.email}</h2>
      <h2>Roles:</h2>
      <ul>
        {u.profiles.map((p) => <li>{p.role}</li>)}
      </ul>
    </>
  );
}
