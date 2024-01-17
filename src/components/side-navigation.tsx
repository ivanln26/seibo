import SideNavigationLink from "@/components/side-navigation-link";
import type { Link } from "@/components/side-navigation-link";

type Props = {
  title: string;
  links: Link[];
};

export default function SideNavigation({ title, links }: Props) {
  return (
    <nav className="flex flex-col gap-2">
      <h1 className="text-4xl font-bold">{title}</h1>
      <ul className="flex flex-col gap-1">
        {links.map(({ name, href }, i) => (
          <li key={i}>
            <SideNavigationLink
              name={name}
              href={href}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
