"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import Icon from "@/components/icons/icon";
import type { Icon as IconType } from "@/components/icons/icon";
import type { Role } from "@/db/schema";

import Logo from "@public/logo.png";

type RailButton = {
  name: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
  roles: Role[];
};

function RailButton({ name, icon, href, isActive, roles }: RailButton) {
  const isAdmin = roles.includes("admin");

  return (
    <Link
      className="flex flex-col justify-center items-center gap-y-1 h-16"
      href={href}
    >
      <div
        className={`flex justify-center items-center h-8 w-14 rounded-full ${
          isActive
            ? (isAdmin
              ? "fill-secondary-900 bg-secondary-100 dark:fill-secondary-100 dark:bg-secondary-700"
              : "fill-primary-900 bg-primary-100 dark:fill-primary-100 dark:bg-primary-700")
            : "fill-black dark:fill-white"
        }`}
      >
        <Icon icon={icon} height={24} width={24} />
      </div>
      <span
        className={`text-sm ${isActive && "font-bold"} ${
          isActive && (isAdmin
            ? "text-secondary-900 dark:text-secondary-100"
            : "text-primary-900 dark:text-primary-100")
        }`}
      >
        {name}
      </span>
    </Link>
  );
}

const buttons: RailButton[] = [
  {
    name: "Asistencia",
    icon: "checklist",
    href: "/lecture",
    roles: ["teacher"],
  },
  {
    name: "Notas",
    icon: "description",
    href: "/test",
    roles: ["teacher"],
  },
  {
    name: "Horarios",
    icon: "clock",
    href: "/schedule",
    roles: ["teacher", "tutor", "principal", "admin"],
  },
  {
    name: "Admin",
    icon: "person",
    href: "/admin",
    roles: ["admin"],
  },
];

type NavigationRailProps = {
  slug: string;
  roles: Role[];
  open: () => void;
};

export default function NavigationRail(
  { slug, roles, open }: NavigationRailProps,
) {
  const pathname = usePathname();

  const btns = buttons.map((button) => ({
    ...button,
    href: `/${slug}${button.href}`,
  }));

  return (
    <nav className="hidden md:flex md:flex-col w-20 h-screen sticky top-0">
      <Link className="" href={`/${slug}`}>
        <Image src={Logo} alt="Seibo Logo" />
      </Link>
      <button
        className="flex flex-col justify-center items-center gap-y-1 mt-2 fill-black dark:fill-white"
        onClick={open}
      >
        <Icon icon="menu" height={24} width={24} />
        <span>Menu</span>
      </button>
      <ul className="flex flex-col gap-y-3 grow mt-6">
        {btns.map((button, i) => {
          const isActive = pathname.startsWith(button.href);

          if (
            roles.filter((role) => button.roles.includes(role)).length === 0
          ) {
            return null;
          }

          return (
            <li key={i}>
              <RailButton isActive={isActive} {...button} roles={roles} />
            </li>
          );
        })}
      </ul>
      <RailButton
        name="Usuario"
        icon="person"
        href={`/${slug}/user`}
        isActive={pathname.startsWith(`/${slug}/user`)}
        roles={roles}
      />
    </nav>
  );
}
