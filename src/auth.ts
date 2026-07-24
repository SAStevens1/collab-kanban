import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      login?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async jwt({ token, profile }) {
      const login = (profile as { login?: string } | undefined)?.login;
      if (login) {
        (token as { login?: string }).login = login;
      }
      return token;
    },
    async session({ session, token }) {
      const login = (token as { login?: string }).login;
      if (login) {
        session.user.login = login;
      }
      return session;
    },
  },
});
