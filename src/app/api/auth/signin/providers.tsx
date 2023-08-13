"use client";

import type { BuiltInProviderType } from "next-auth/providers";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react/types";
import { signIn } from "next-auth/react";

import Button from "@/components/button";

type ButtonProviders = {
  providers: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;
};

export default function Providers({ providers }: ButtonProviders) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button
            onClick={() => {
              signIn(provider.id);
            }}
            kind="outlined"
          >
            Iniciar Sesión con {provider.name}
          </Button>
        </div>
      ))}
    </>
  );
}
