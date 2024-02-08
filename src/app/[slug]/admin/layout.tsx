import SideNavigation from "@/components/side-navigation";
import type { Link } from "@/components/side-navigation-link";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default function AdminLayout({ children, params }: Props) {
  const links: Link[] = [
    { name: "Aula", href: `/${params.slug}/admin/classroom` },
    { name: "Clase", href: `/${params.slug}/admin/instance` },
    { name: "Configuración", href: `/${params.slug}/admin/configuration` },
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
