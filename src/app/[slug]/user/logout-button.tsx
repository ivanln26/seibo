"use client";

import { signOut } from "next-auth/react";

import Button from "@/components/button";

export default function LogOutButton() {
  return (
    <div>
      <Button onClick={() => signOut()}>
        Cerrar Sesión
      </Button>
    </div>
  );
}
