import type { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { db } from "@/db/db";
import { user } from "@/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
    } & DefaultSession["user"];
  }
}

const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, trigger }) {
      if (trigger === "signIn") {
        const { email, name } = userSchema.parse({
          email: token.email,
          name: token.name,
        });

        await db.insert(user).values({ email, name }).onDuplicateKeyUpdate({
          set: { name },
        });
      }
      return token;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
};
