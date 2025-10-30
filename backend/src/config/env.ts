// Environment configuration with validation

export const config = {
  // Server
  PORT: Number.parseInt(process.env.PORT || "3001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost/defi_booking",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  // PayPal
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_SECRET: process.env.PAYPAL_SECRET || "",
  PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID || "",
  PAYPAL_MODE: process.env.PAYPAL_MODE || "sandbox",

  // NOWPayments
  NOWPAYMENTS_API_KEY: process.env.NOWPAYMENTS_API_KEY || "",
  NOWPAYMENTS_IPN_SECRET: process.env.NOWPAYMENTS_IPN_SECRET || "",

  // NFT Configuration
  ENABLE_NFTS: process.env.ENABLE_NFTS === "true",
  NFT_STORAGE_API_KEY: process.env.NFT_STORAGE_API_KEY || "",
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || "",
  ETH_PRIVATE_KEY: process.env.ETH_PRIVATE_KEY || "",
  DEFAULT_CHAIN: (process.env.DEFAULT_CHAIN || "polygon") as "polygon" | "ethereum" | "solana",

  // Blockchain
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
  ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/",

  // Security
  KMS_KEY_ID: process.env.KMS_KEY_ID || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key",

  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN || "",

  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  API_URL: process.env.API_URL || "http://localhost:3001",
}

// Validate required environment variables
export function validateConfig() {
  const required = ["PAYPAL_CLIENT_ID", "PAYPAL_SECRET", "NOWPAYMENTS_API_KEY"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
  }
}
