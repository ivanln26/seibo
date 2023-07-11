"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import Icon from "@/components/icons/icon";
import type { Icon as IconType } from "@/components/icons/icon";

import Logo from "@/../public/logo.png";

type RailButton = {
  name: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
};

function RailButton({ name, icon, href, isActive }: RailButton) {
  return (
    <Link
      className="flex flex-col justify-center items-center gap-y-1 h-16"
      href={href}
    >
      <div
        className={`flex justify-center items-center h-8 w-14 rounded-full ${
          isActive
            ? "fill-primary-900 bg-primary-100 dark:fill-primary-100 dark:bg-primary-700"
            : "fill-black dark:fill-white"
        }`}
      >
        <Icon icon={icon} height={24} width={24} />
      </div>
      <span
        className={`text-sm ${
          isActive && "font-bold text-primary-900 dark:text-primary-100"
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
    href: "/attendance",
  },
  {
    name: "Notas",
    icon: "description",
    href: "/test",
  },
  {
    name: "Horarios",
    icon: "clock",
    href: "/schedule",
  },
];

type NavigationRailProps = {
  toggleDrawer: () => void;
};

export default function NavigationRail({ toggleDrawer }: NavigationRailProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:flex-col w-20 h-screen">
      <Link className="" href="/">
        <Image src={Logo} alt="Seibo Logo" />
      </Link>
      <button onClick={toggleDrawer}>
        Toggle
      </button>
      <ul className="flex flex-col gap-y-3 grow mt-2">
        {buttons.map((props, i) => {
          const isActive = pathname.startsWith(props.href);

          return (
            <li key={i}>
              <RailButton isActive={isActive} {...props} />
            </li>
          );
        })}
      </ul>
      <RailButton
        name="Usuario"
        icon="person"
        href="/user"
        isActive={pathname.startsWith("/user")}
      />
    </nav>
  );
}
