"use client";

import { useState } from "react";

import NavigationDrawer from "@/components/nav-drawer";
import NavigationRail from "@/components/rail";
import TopBar from "@/components/top-bar";

export default function Navigation({ slug }: { slug: string }) {
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
      <NavigationDrawer slug={slug} isOpen={isOpen} close={close} />
      <NavigationRail slug={slug} open={open} />
    </>
  );
}
