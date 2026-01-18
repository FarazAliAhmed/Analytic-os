import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string | null
      firstName: string | null
      lastName: string | null
      phone: string | null
      walletAddress: string | null
      role: string | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name: string
    username?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    walletAddress?: string | null
    role?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    walletAddress?: string | null
    role?: string | null
  }
}
