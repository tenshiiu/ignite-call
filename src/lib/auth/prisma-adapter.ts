import { Adapter, AdapterUser } from "next-auth/adapters"
import { prisma } from "../prisma"
import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import { destroyCookie, parseCookies } from "nookies"

export function PrismaAdapter(req:NextApiRequest | NextPageContext['req'], res:NextApiResponse | NextPageContext['res']): Adapter {
  return {

    async createUser(user: AdapterUser): Promise<AdapterUser> {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
      throw new Error('User ID not found on cookies.')
      }

      const prismaUser = await prisma.user.update({
      where: {
        id: userIdOnCookies,
      },
      data: {
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
      })

      destroyCookie({ res }, '@ignitecall:userId', {
      path: '/',
      })

      return {
      id: prismaUser.id,
      name: prismaUser.name,
      username: prismaUser.username,
      email: prismaUser.email!,
      emailVerified: null,
      avatar_url: prismaUser.avatar_url!,
      }
    },

    async getUser(id) {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id,
            }
        })

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUniqueOrThrow({
            where: {
                email,
            }
        })

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
        const { user } = await prisma.account.findFirstOrThrow({
            where: {
                provider_account_id: providerAccountId,
                provider: provider,
            },
            include: {
                user: true
            }
        })
        
        return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        }
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
            id: user.id!,
        },
        data: {
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url,
        }
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        avatar_url: prismaUser.avatar_url!,
        emailVerified: null,
      }
    },

    async linkAccount(account: import("next-auth/adapters").AdapterAccount) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        }
      })
    },
    
    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
            user_id: userId,
            expires,
            session_token: sessionToken,
        }
      })

      return {
        userId,
        expires,
        sessionToken,
      }
    },

    async getSessionAndUser(sessionToken) {
      const { user, ...session } = await prisma.session.findUniqueOrThrow({
        where: {
            session_token: sessionToken,
        },
        include: {
            user: true,
        }
      })

      return {
        session: {
            userId: session.user_id,
            expires: session.expires,
            sessionToken: session.session_token
        },
        user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
            session_token: sessionToken,
        },
        data: {
            user_id: userId,
            expires,
        }
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },
    
    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken
        }
      })
    }
  }
}