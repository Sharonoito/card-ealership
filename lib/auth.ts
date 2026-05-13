import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = credentials as any;

        const username = creds?.username || creds?.["1_username"];
        const password = creds?.password || creds?.["1_password"];

        if (!username || !password) return null;

        const user = await (prisma as any).user.findUnique({
          where: { username: String(username) },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          String(password),
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: "Admin",
          email: `${user.username}@dealership.local`,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET,
  callbacks: {

    async jwt({ token, user }: any) {
      // `user` is present on initial sign-in
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user = (session as any).user ?? {};
      (session as any).user.role = token.role;
      return session;
    },
  },
});
