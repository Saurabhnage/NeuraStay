// Core type definitions for the DeFi booking platform

export interface User {
  id: string
  email: string
  encryptedName: string
  kycStatus: "pending" | "approved" | "rejected"
  defaultWalletAddress?: string
  createdAt: Date
  updatedAt: Date
}

export interface Merchant {
  id: string
  name: string
  paypalMerchantId?: string
  settlementCurrency: "USD" | "INR" | "EUR"
  kycInfo?: Record<string, unknown>
  acceptPYUSD: boolean
  acceptNFTs: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  merchantId: string
  title: string
  description: string
  basePriceUsd: number
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  userId: string
  serviceId: string
  merchantId: string
  priceUsd: number
  status: "pending" | "paid" | "cancelled" | "completed"
  bookingHash: string
  checkIn: Date
  checkOut: Date
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  bookingId: string
  provider: "paypal" | "nowpayments" | "stripe"
  providerPaymentId: string
  amountUsd: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  capturedAt?: Date
  rawResponseJson: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface NFT {
  id: string
  bookingId: string
  tokenId: string
  tokenUri: string
  chain: "polygon" | "ethereum" | "solana"
  mintTx: string
  metadataCid: string
  createdAt: Date
  updatedAt: Date
}

export interface WebhookLog {
  id: string
  provider: string
  payload: Record<string, unknown>
  headers: Record<string, string>
  verified: boolean
  createdAt: Date
}

export interface PaymentOption {
  provider: "paypal" | "nowpayments"
  label: string
  url?: string
  clientToken?: string
}
