import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { db } from "@/db/db";
import { user } from "@/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      roles: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    roles: string[];
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

        const u = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, email),
          with: { profiles: true },
        });

        if (!u) throw new Error("user not in db");

        token.roles = u.profiles.map((p) => p.role);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
};
