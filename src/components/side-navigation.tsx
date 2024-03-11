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
      <ul className="flex flex-col lg:justify-evenly gap-1 lg:h-screen text-center border-b-2 lg:border-b-0 lg:border-r-2 lg:border-l-2 border-gray">
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
