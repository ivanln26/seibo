"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Icon from "@/components/icons/icon";
import type { Icon as IconType } from "@/components/icons/icon";
import type { Role } from "@/db/schema";

type DrawerButton = {
  name: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
  roles: Role[];
};

const buttons: DrawerButton[] = [
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
];

function DrawerButton({ name, icon, href, isActive }: DrawerButton) {
  return (
    <Link
      className={`flex items-center gap-x-3 w-[300px] h-12 px-4 rounded-full ${
        isActive
          ? "text-primary-900 fill-primary-900 bg-primary-100 dark:text-primary-100 dark:fill-primary-100 dark:bg-primary-700"
          : "fill-black dark:fill-white"
      }`}
      href={href}
    >
      <Icon icon={icon} height={24} width={24} />
      {name}
    </Link>
  );
}

type NavigationDrawerProps = {
  slug: string;
  roles: Role[];
  isOpen: boolean;
  close: () => void;
};

export default function NavigationDrawer(
  { slug, roles, isOpen, close }: NavigationDrawerProps,
) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const btns = buttons.map((button) => ({
    ...button,
    href: `/${slug}${button.href}`,
  }));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <nav
      className={`${
        isOpen ? "absolute" : "hidden"
      } h-[100svh] px-1 py-2 bg-neutral-98 dark:bg-neutral-5 z-50`}
      ref={ref}
    >
      <ul>
        {btns.map((button, i) => {
          const isActive = pathname.startsWith(button.href);

          if (
            roles.filter((role) => button.roles.includes(role)).length === 0
          ) {
            return null;
          }

          return (
            <li key={i}>
              <DrawerButton isActive={isActive} {...button} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
