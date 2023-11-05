"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminNavigationButtonProps = {
  name: string;
  href: string;
};

export default function AdminNavigationButton(
  { name, href }: AdminNavigationButtonProps,
) {
  const pathname = usePathname();

  return (
    <Link
      className={`${
        pathname.startsWith(href) && "underline"
      } text-secondary-600 dark:text-secondary-200`}
      href={href}
    >
      {name}
    </Link>
  );
}
