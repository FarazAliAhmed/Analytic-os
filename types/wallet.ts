// types/wallet.ts

export interface Wallet {
  id: string
  userId: string
  accountNumber: string
  bankName: string
  accountName: string
  accountRef: string
  balance: number // in kobo
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  walletId: string
  type: 'credit' | 'debit'
  amount: number // in kobo
  formattedAmount: string
  description: string
  reference: string
  monnifyRef?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

export interface WalletResponse {
  success: boolean
  data?: {
    wallet?: Wallet
    transactions?: Transaction[]
    balance?: number
    formattedBalance?: string
  }
  error?: string
}

export interface CreateWalletResponse {
  success: boolean
  data?: {
    accountNumber: string
    bankName: string
    accountName: string
  }
  error?: string
}

export interface SyncWalletResponse {
  success: boolean
  data?: {
    newTransactions: number
    totalCredited: number
    formattedTotal: string
  }
  error?: string
}
