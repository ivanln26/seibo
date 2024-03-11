"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Link = {
  name: string;
  href: string;
};

type Props = Link;

export default function SideNavigationLink({ name, href }: Props) {
  const pathname = usePathname();

  return (
    <Link
      className={`${
        pathname.startsWith(href) && "underline"
      } text-lg text-black dark:text-secondary-200`}
      href={href}
    >
      {name}
    </Link>
  );
}
