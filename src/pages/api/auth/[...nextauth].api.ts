import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "../../../lib/auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";

export const buildNextAuthOptions = (
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions => {
    return {
      adapter: PrismaAdapter(req, res),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
        }
      }
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if(!account?.scope?.includes('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar')
      ) {
        return '/register/connect-calendar/?error=permissions'
      }

      return true
    },

    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          name: user.name ?? null,
          username: user.username ?? null,
          email: user.email ?? null,
          avatar_url: user.avatar_url ?? null,
        },
      }
    },
  }
    }
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}