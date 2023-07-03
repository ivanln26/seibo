"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Icon from "@/components/icons/icon";
import type { Icon as IconType } from "@/components/icons/icon";

type Button = {
  name: string;
  icon: IconType;
  href: string;
};

const buttons: Button[] = [
  {
    name: "Inicio",
    icon: "home",
    href: "/",
  },
  {
    name: "Asistencia",
    icon: "checklist",
    href: "/asistencia",
  },
  {
    name: "Notas",
    icon: "description",
    href: "/notas",
  },
  {
    name: "Horarios",
    icon: "clock",
    href: "/horarios",
  },
];

export default function RailButtons() {
  const pathname = usePathname();

  return (
    <>
      {buttons.map(({ name, icon, href }) => {
        const isActive = pathname.startsWith(href);
        return (
          <li className="h-16">
            <Link
              className="flex flex-col justify-center items-center gap-y-1 h-full"
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
                className={`text-xs ${
                  isActive
                    ? "font-bold text-primary-900 dark:text-primary-100"
                    : "text-black dark:text-white"
                }`}
              >
                {name}
              </span>
            </Link>
          </li>
        );
      })}
    </>
  );
}
