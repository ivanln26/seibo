import { redirect } from "next/navigation";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Providers from "@/app/api/auth/signin/providers";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  const providers = await getProviders();

  if (session) {
    return redirect("/user");
  }

  if (!providers) {
    throw new Error("xd");
  }

  return (
    <>
      Iniciar Session
      <Providers providers={providers} />
    </>
  );
}
