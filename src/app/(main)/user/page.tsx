"use client";

import { signOut, useSession } from "next-auth/react";

import Button from "@/components/button";

export default function Page() {
  const { data: session } = useSession();

  return (
    <>
      <h1>Usuario</h1>
      <h2>{session?.user?.email}</h2>
      <Button onClick={() => signOut()}>
        Log Out
      </Button>
    </>
  );
}
