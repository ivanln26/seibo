import SideNavigation from "@/components/side-navigation";
import type { Link } from "@/components/side-navigation-link";
import { getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Props = {
  slug: string;
};

export default async function Page({ slug }: Props) {
  const user = await getUserProfile({ slug });

  const links: Link[] = [
    { name: "Todos los tutores", href: `/${slug}/notification/all` },
    { name: "Tutores de un curso", href: `/${slug}/notification/course` },
    { name: "Tutor de un alumno", href: `/${slug}/notification/student` },
  ];

  if (
    user.profiles.filter((p) => p.role === "admin" || p.role === "principal")
      .length === 0
  ) {
    links.shift();
  }

  return <SideNavigation title="Notificación" links={links} />;
}
