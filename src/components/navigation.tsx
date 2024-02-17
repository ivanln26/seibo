"use client";

import { useState } from "react";

import NavigationDrawer from "@/components/nav-drawer";
import NavigationRail from "@/components/rail";
import TopBar from "@/components/top-bar";
import type { Role } from "@/db/schema";

type NavigationProps = {
  slug: string;
  roles: Role[];
  logoPath: string;
};

export default function Navigation({ slug, roles, logoPath }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <TopBar open={open} />
      <NavigationDrawer
        slug={slug}
        roles={roles}
        isOpen={isOpen}
        close={close}
      />
      <NavigationRail
        slug={slug}
        roles={roles}
        logoPath={logoPath}
        open={open}
      />
    </>
  );
}
