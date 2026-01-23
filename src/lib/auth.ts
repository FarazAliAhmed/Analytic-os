import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Twitter from 'next-auth/providers/twitter'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth/password'
import { generateUserId } from '@/lib/user-id'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
        },
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'email,public_profile',
          prompt: 'consent',
        },
      },
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'tweet.read users.read offline.access',
          prompt: 'consent',
        },
      },
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) {
          throw new Error('No account found with this email')
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) {
          throw new Error('Incorrect password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          userId: user.userId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          walletAddress: user.walletAddress,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id
        token.userId = (user as any).userId
        token.username = (user as any).username
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName
        token.phone = (user as any).phone
        token.walletAddress = (user as any).walletAddress
        token.role = (user as any).role
        token.image = (user as any).image
      }
      
      // Handle session update trigger (when updateSession is called)
      if (trigger === 'update' && session) {
        token.username = session.user?.name || token.username
        token.firstName = session.user?.firstName || token.firstName
        token.lastName = session.user?.lastName || token.lastName
        token.phone = session.user?.phone || token.phone
        token.image = session.user?.image || token.image
      }
      
      // Fetch fresh role from database for existing sessions
      if (token.id && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      // Update image from OAuth provider
      if (account?.provider === 'google' || account?.provider === 'facebook' || account?.provider === 'twitter') {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.userId = token.userId as string | null
        session.user.name = token.username as string
        session.user.username = token.username as string | null
        session.user.firstName = token.firstName as string | null
        session.user.lastName = token.lastName as string | null
        session.user.phone = token.phone as string | null
        session.user.walletAddress = token.walletAddress as string | null
        session.user.image = token.image as string | null
        session.user.role = token.role as string | null
      }
      return session
    },
    async signIn({ user, account }) {
      // Allow OAuth sign-in
      if (account?.provider === 'google' || account?.provider === 'facebook' || account?.provider === 'twitter') {
        return true
      }
      // Credentials handled separately
      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Welcome email on new registration
    },
    async signIn({ user, account, isNewUser }) {
      // Handle new OAuth users - create database records
      if (isNewUser && (account?.provider === 'google' || account?.provider === 'facebook' || account?.provider === 'twitter')) {
        try {
          // Generate username from email or name
          const username = user.email?.split('@')[0] || `user_${Date.now()}`
          const uniqueUsername = `${username}_${Math.random().toString(36).substring(2, 6)}`

          // Create user in database
          const nameParts = (user.name || 'User').split(' ')
          const dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              username: uniqueUsername,
              userId: generateUserId(),
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(' ') || nameParts[0],
              image: user.image,
              emailVerified: new Date(),
            }
          })

          // Create account record
          await prisma.account.create({
            data: {
              userId: dbUser.id,
              type: 'oauth',
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              id_token: account.id_token,
              scope: account.scope,
            }
          })

          // Create wallet automatically for OAuth users
          try {
            const { createReservedAccount } = await import('@/lib/monnify')
            const monnifyAccount = await createReservedAccount({
              email: user.email!,
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(' ') || nameParts[0],
              reference: `WALLET_${dbUser.id}_${Date.now()}`
            })

            await prisma.wallet.create({
              data: {
                userId: dbUser.id,
                accountNumber: monnifyAccount.accountNumber,
                bankName: monnifyAccount.bankName,
                accountName: monnifyAccount.accountName,
                accountRef: monnifyAccount.accountReference,
                balance: 0
              }
            })
          } catch (walletError) {
            console.error('Failed to create wallet for OAuth user:', walletError)
          }
        } catch (error) {
          console.error('Failed to create OAuth user records:', error)
        }
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
})

// Export authOptions for API routes (NextAuth v5 format)
interface JWTPayload {
  id?: string
  userId?: string | null
  firstName?: string | null
  lastName?: string | null
  walletAddress?: string | null
}

interface UserPayload {
  id: string
  email: string
  name: string
  userId?: string | null
  username?: string | null
  firstName?: string | null
  lastName?: string | null
  walletAddress?: string | null
}

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) {
          throw new Error('No account found with this email')
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) {
          throw new Error('Incorrect password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username || user.email.split('@')[0],
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          walletAddress: user.walletAddress,
        } as UserPayload
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWTPayload; user?: UserPayload }) {
      if (user) {
        token.id = user.id
        token.userId = user.userId
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.walletAddress = user.walletAddress
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWTPayload }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.userId = token.userId as string | null
        session.user.firstName = token.firstName as string | null
        session.user.lastName = token.lastName as string | null
        session.user.walletAddress = token.walletAddress as string | null
      }
      return session
    },
  },
}
