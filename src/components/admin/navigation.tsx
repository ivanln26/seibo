import AdminNavigationButton from "./navigation-button";
import type { AdminNavigationButtonProps } from "./navigation-button";

type Props = {
  slug: string;
};

const adminNavButtons: AdminNavigationButtonProps[] = [
  { name: "Aula", href: "classroom" },
  { name: "Clase", href: "instance" },
  { name: "Horario", href: "schedule" },
  { name: "Materia", href: "course" },
  { name: "Estudiante", href: "student" },
  { name: "Usuario", href: "user" },
];

export default function AdminNavigation({ slug }: Props) {
  return (
    <nav className="px-4">
      <h1 className="text-xl font-bold">Administrador</h1>
      <ul className="mt-2">
        {adminNavButtons.map(({ name, href }) => (
          <li>
            <AdminNavigationButton
              name={name}
              href={`/${slug}/admin/${href}`}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
