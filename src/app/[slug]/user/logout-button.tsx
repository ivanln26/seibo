"use client";

import { signOut } from "next-auth/react";

import Button from "@/components/button";

export default function LogOutButton({text = "Cerrar Sesión"}: {text?: string }) {
  return (
    <div>
      <Button onClick={() => signOut()}>
        {text}
      </Button>
    </div>
  );
}
