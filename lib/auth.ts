import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Cast to 'any' to stop the TypeScript error 2551
        const creds = credentials as any;

        // Try standard names first, then fall back to the prefixed names from your screenshot
        const username = creds?.username || creds?.["1_username"];
        const password = creds?.password || creds?.["1_password"];

        if (!username || !password) {
          console.error("Auth: Missing username or password in payload");
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        console.log("DEBUG: ADMIN_USERNAME:", adminUsername);
        console.log("DEBUG: ADMIN_PASSWORD_HASH:", adminPasswordHash);

        if (!adminUsername || !adminPasswordHash) {
          console.error("Auth: .env variables are not loading!");
          return null;
        }

        if (String(username).toLowerCase() !== adminUsername.toLowerCase()) {
          console.error("Auth: Username does not match admin");
          return null;
        }

        const isValid = await bcrypt.compare(
          password as string,
          adminPasswordHash
        );

        if (!isValid) {
          console.error("Auth: Password hash comparison failed");
          return null;
        }

        console.log("Auth: Login successful!");
        return { id: "1", name: "Admin", email: "admin@dealership.local" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET,
});