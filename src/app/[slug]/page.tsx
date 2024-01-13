import Link from "next/link";

import Button from "@/components/button";
import { db } from "@/db/db";
import type { Role } from "@/db/schema";
import { getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

type Color = "primary" | "secondary" | "tertiary";

const colors: Record<Color, string> = {
  primary:
    "bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100",
  secondary:
    "bg-secondary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100",
  tertiary:
    "bg-tertiary-100 text-tertiary-900 dark:bg-tertiary-700 dark:text-tertiary-100",
};

type CardProps = {
  title: string;
  description: string;
  path: string;
  color?: Color;
  roles?: Role[];
};

export default async function Home({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const roles = user.profiles.map((p) => p.role);
  const school = await db.query.school.findFirst({
    where: (sc, { eq }) => eq(sc.slug, params.slug),
  });

  const cards: CardProps[] = [
    {
      title: "Asistencias",
      description:
        "Toma asistencia de tus clases, anota observaciones sobre las mismas.",
      path: `${params.slug}/lecture`,
    },
    {
      title: "Examenes",
      description:
        "Registra información acerca de los examenes de tus materias y los resultados de los alumnos.",
      path: `${params.slug}/test`,
    },
    {
      title: "Horarios",
      description: "Revisa tus horarios en la institución.",
      path: `${params.slug}/schedule`,
    },
    {
      title: "Notificaciones",
      description: "Envia e-mails a los tutores de los alumnos.",
      path: `${params.slug}/notification`,
    },
    {
      title: "Reportes",
      description:
        "Visualiza e imprime reportes con indicadores y estadisticas relevantes.",
      path: `${params.slug}/dashboard`,
      color: "secondary",
      roles: ["admin", "principal"],
    },
    {
      title: "Admin",
      description:
        "Administra la información general del colegio y del sistema.",
      path: `${params.slug}/dashboard`,
      color: "secondary",
      roles: ["admin", "principal"],
    },
  ];

  return (
    <section className="flex flex-col p-6 gap-y-4">
      <h1 className="text-4xl font-bold">
        Bienvenido a SEIBO &#128394;
      </h1>
      <p className="text-primary-600 dark:text-primary-200">
        Gestiona fácilmente la información de la institución{" "}
        <b>{school?.name}</b>
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) =>
          (!card.roles ||
            roles.filter((role) => card.roles?.includes(role)).length > 0) &&
          (
            <div
              className={`flex flex-col justify-between gap-y-2 px-4 py-6 rounded ${
                !!card.color ? colors[card.color] : colors["primary"]
              }`}
              key={i}
            >
              <h2 className="text-xl font-bold">{card.title}</h2>
              <p>{card.description}</p>
              <Link href={card.path}>
                <Button color={card.color}>Ver detalle</Button>
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
}
