import { redirect } from "next/navigation";

import SideNavigation from "@/components/side-navigation";
import { Link } from "@/components/side-navigation-link";
import { getUserProfile, hasRoles } from "@/db/queries";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default async function Layout({ children, params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const isAdminOrPrincipal = await hasRoles(user, "OR", "admin", "principal");

  if (!isAdminOrPrincipal) {
    redirect(`/${params.slug}`);
  }

  const links: Link[] = [
    { name: "Asistencia", href: `/${params.slug}/history/lecture` },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <SideNavigation title="Historial" links={links} />
      <section className="grow py-2 md:px-4 md:py-0">
        {children}
      </section>
    </div>
  );
}
