import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

