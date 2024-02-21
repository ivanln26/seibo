import Link from "next/link";
import { redirect } from "next/navigation";

import type { TwColor } from "@/color";
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

const colors: Record<TwColor, string> = {
  primary:
    "bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100",
  secondary:
    "bg-secondary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100",
  red: "bg-red-100 text-red-900 dark:bg-red-700 dark:text-red-100",
  orange:
    "bg-orange-100 text-orange-900 dark:bg-orange-700 dark:text-orange-100",
  yellow:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100",
  lime: "bg-lime-100 text-lime-900 dark:bg-lime-700 dark:text-lime-100",
  green: "bg-green-100 text-green-900 dark:bg-green-700 dark:text-green-100",
  emerald:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-100",
  cyan: "bg-cyan-100 text-cyan-900 dark:bg-cyan-700 dark:text-cyan-100",
  blue: "bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-blue-100",
  violet:
    "bg-violet-100 text-violet-900 dark:bg-violet-700 dark:text-violet-100",
  purple:
    "bg-purple-100 text-purple-900 dark:bg-purple-700 dark:text-purple-100",
  fuchsia:
    "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-700 dark:text-fuchsia-100",
  pink: "bg-pink-100 text-pink-900 dark:bg-pink-700 dark:text-pink-100",
};

type CardProps = {
  title: string;
  description: string;
  path: string;
  color: "primary" | "secondary";
  roles?: Role[];
};

const subtitleColors: Record<TwColor, string> = {
  primary: "text-primary-600 dark:text-primary-200",
  secondary: "text-secondary-600 dark:text-secondary-200",
  red: "text-red-600 dark:text-red-200",
  orange: "text-orange-600 dark:text-orange-200",
  yellow: "text-yellow-600 dark:text-yellow-200",
  lime: "text-lime-600 dark:text-lime-200",
  green: "text-green-600 dark:text-green-200",
  emerald: "text-emerald-600 dark:text-emerald-200",
  cyan: "text-cyan-600 dark:text-cyan-200",
  blue: "text-blue-600 dark:text-blue-200",
  violet: "text-violet-600 dark:text-violet-200",
  purple: "text-purple-600 dark:text-purple-200",
  fuchsia: "text-fuchsia-600 dark:text-fuchsia-200",
  pink: "text-pink-600 dark:text-pink-200",
};

export default async function Home({ params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const roles = user.profiles.map((p) => p.role);
  const school = await db.query.school.findFirst({
    where: (sc, { eq }) => eq(sc.slug, params.slug),
  });

  if (school === undefined) {
    redirect("/");
  }

  const primaryColor = school.settings?.color.primary || "primary";
  const secondaryColor = school.settings?.color.secondary || "secondary";

  const cards: CardProps[] = [
    {
      title: "Asistencias",
      description:
        "Toma asistencia de tus clases, anota observaciones sobre las mismas.",
      path: `/${params.slug}/lecture`,
      color: "primary",
    },
    {
      title: "Exámenes",
      description:
        "Registra información acerca de los exámenes de tus materias y los resultados de los alumnos.",
      path: `/${params.slug}/test`,
      color: "primary",
    },
    {
      title: "Horarios",
      description: "Revisa tus horarios en la institución.",
      path: `/${params.slug}/schedule`,
      color: "primary",
    },
    {
      title: "Notificaciones",
      description: "Envia e-mails a los tutores de los alumnos.",
      path: `/${params.slug}/notification`,
      color: "primary",
    },
    {
      title: "Reportes",
      description:
        "Visualiza e imprime reportes con indicadores y estadisticas relevantes.",
      path: `/${params.slug}/dashboard`,
      color: "secondary",
      roles: ["admin", "principal"],
    },
    {
      title: "Admin",
      description:
        "Administra la información general del colegio y del sistema.",
      path: `/${params.slug}/dashboard`,
      color: "secondary",
      roles: ["admin", "principal"],
    },
    {
      title: "Historial",
      description:
        "Información histórica acerca de los exámenes y asistencias.",
      path: `/${params.slug}/history`,
      color: "secondary",
      roles: ["admin", "principal"],
    },
  ];

  return (
    <section className="flex flex-col p-6 gap-y-4">
      <h1 className="text-4xl font-bold">
        Bienvenido a SEIBO &#128394;
      </h1>
      <p className={subtitleColors[primaryColor]}>
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
                card.color === "primary"
                  ? colors[primaryColor]
                  : colors[secondaryColor]
              }`}
              key={i}
            >
              <h2 className="text-xl font-bold">{card.title}</h2>
              <p>{card.description}</p>
              <Link href={card.path}>
                <Button
                  color={card.color === "primary"
                    ? primaryColor
                    : secondaryColor}
                >
                  Ver detalle
                </Button>
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
}
