import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName: string | null
      lastName: string | null
      walletAddress: string | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name: string
    firstName?: string | null
    lastName?: string | null
    walletAddress?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    firstName?: string | null
    lastName?: string | null
    walletAddress?: string | null
  }
}
