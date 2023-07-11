"use client";

import { useState } from "react";

import NavigationDrawer from "@/components/nav-drawer";
import NavigationRail from "@/components/rail";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <NavigationDrawer isOpen={isOpen} toggleOpen={toggleDrawer} />
      <NavigationRail toggleDrawer={toggleDrawer} />
    </>
  );
}
