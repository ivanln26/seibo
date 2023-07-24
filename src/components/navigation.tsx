"use client";

import { useState } from "react";

import NavigationDrawer from "@/components/nav-drawer";
import NavigationRail from "@/components/rail";
import TopBar from "@/components/top-bar";

export default function Navigation() {
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
      <NavigationDrawer isOpen={isOpen} close={close} />
      <NavigationRail open={open} />
    </>
  );
}
