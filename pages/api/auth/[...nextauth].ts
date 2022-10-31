import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prismadb';
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authOptions,
  session: { strategy: "jwt" },
  callbacks: {
    session: async ({ session, token }) => {
      // return {
      //   ...session,
      //   id: token.sub,
      // }
      session.user = {
        // @ts-ignore
        id: token.sub,
        ...session.user,
      };
      return session;
    },
  },
})