import SideNavigation from "@/components/side-navigation";
import type { Link } from "@/components/side-navigation-link";
import { getUserProfile, hasRoles } from "@/db/queries";

export const revalidate = 0;

type Props = {
  slug: string;
};

export default async function Page({ slug }: Props) {
  const user = await getUserProfile({ slug });
  const isAdminOrPrincipal = await hasRoles(user, "OR", "admin", "principal");

  const links: Link[] = [
    { name: "Todos los tutores", href: `/${slug}/notification/all` },
    { name: "Tutores de un curso", href: `/${slug}/notification/grade` },
    { name: "Tutor de un alumno", href: `/${slug}/notification/student` },
  ];

  if (!isAdminOrPrincipal) {
    links.shift();
  }

  return <SideNavigation title="Notificación" links={links} />;
}
