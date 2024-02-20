import { redirect } from "next/navigation";

import SideNavigation from "@/components/side-navigation";
import type { Link } from "@/components/side-navigation-link";
import { getUserProfile, hasRoles } from "@/db/queries";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default async function AdminLayout({ children, params }: Props) {
  const user = await getUserProfile({ slug: params.slug });
  const isAdmin = await hasRoles(user, "OR", "admin");

  if (!isAdmin) {
    redirect(`/${params.slug}`);
  }

  const links: Link[] = [
    { name: "Aula", href: `/${params.slug}/admin/classroom` },
    { name: "Clase", href: `/${params.slug}/admin/instance` },
    { name: "Configuración", href: `/${params.slug}/admin/settings` },
    { name: "Curso", href: `/${params.slug}/admin/grade` },
    { name: "Estudiante", href: `/${params.slug}/admin/student` },
    { name: "Horario", href: `/${params.slug}/admin/schedule` },
    { name: "Materia", href: `/${params.slug}/admin/course` },
    { name: "Preceptor", href: `/${params.slug}/admin/tutor` },
    { name: "Usuario", href: `/${params.slug}/admin/user` },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <SideNavigation title="Administrador" links={links} />
      <section className="py-2 w-full md:px-4 md:py-0">
        {children}
      </section>
    </div>
  );
}
