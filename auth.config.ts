import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    authorized({ request, auth }: { request: NextRequest; auth: any }) {
      const { pathname } = request.nextUrl;
      if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/calendar") ||
        pathname.startsWith("/progress") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/workout")
      ) {
        return !!auth;
      }
      return true;
    },
    jwt({ token, user, account }: { token: JWT; user: any; account: any }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};

