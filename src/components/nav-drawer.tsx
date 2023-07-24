"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Icon from "@/components/icons/icon";
import type { Icon as IconType } from "@/components/icons/icon";

type DrawerButton = {
  name: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
};

const buttons: DrawerButton[] = [
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
  isOpen: boolean;
  close: () => void;
};

export default function NavigationDrawer(
  { isOpen, close }: NavigationDrawerProps,
) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

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
      } h-[100svh] px-1 bg-neutral-98 dark:bg-neutral-5`}
      ref={ref}
    >
      <ul>
        {buttons.map((button, i) => {
          const isActive = pathname.startsWith(button.href);

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
