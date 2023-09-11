"use client";

import { signOut, useSession } from "next-auth/react";

import Button from "@/components/button";

export default function Page() {
  const { data: session } = useSession();

  return (
    <>
      <h1>Usuario</h1>
      <h2>Email: {session?.user?.email}</h2>
      <h2>Roles:</h2>
      <ul>
        {session?.user?.roles?.map((r) => <li>{r}</li>)}
      </ul>
      <Button onClick={() => signOut()}>
        Log Out
      </Button>
    </>
  );
}
