import Image from "next/image";
import { redirect } from "next/navigation";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Providers from "@/app/api/auth/signin/providers";
import banner from "@public/banner.png";
import logo from "@public/logo.png";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  const providers = await getProviders();

  if (session) {
    return redirect("/");
  }

  if (!providers) {
    throw new Error("Could not load the providers");
  }

  return (
    <main className="flex h-[100svh] w-full">
      <section className="flex flex-col justify-center items-center gap-y-4 grow">
        <p className="flex items-center gap-x-1 text-5xl">
          <Image src={logo} alt="Seibo" height={80} width={80} />
          Seibo
        </p>
        <Providers providers={providers} />
      </section>
      <Image className="hidden lg:block" src={banner} alt="Seibo banner" />
    </main>
  );
}
