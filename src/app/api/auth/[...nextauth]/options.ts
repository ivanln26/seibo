import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/db/db";
import { user } from "@/db/schema";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token }) {
      console.log("Token", token);
      await db.insert(user).values({
        email: token.email || "",
        name: token.name || "",
      }).onDuplicateKeyUpdate({ set: { name: token.name || "" } });
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
