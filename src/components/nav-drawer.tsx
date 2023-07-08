"use client";

import type { Icon as IconType } from "@/components/icons/icon";

type DrawerButton = {
  name: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
};

const buttons = [
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

export default function NavigationDrawer() {
  return (
    <nav className="absolute h-[100svh] px-1 bg-blue-500">
      <ul>
        {buttons.map((button, i) => (
          <li className="w-[300px] h-[56px] rounded-full bg-red-300" key={i}>
            {button.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
