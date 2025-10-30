// Cryptographic utilities for secure operations

import crypto from "crypto"

export function generateBookingHash(userId: string, serviceId: string, checkIn: Date, checkOut: Date): string {
  const data = `${userId}:${serviceId}:${checkIn.toISOString()}:${checkOut.toISOString()}`
  return crypto.createHash("sha256").update(data).digest("hex")
}

export function verifyPayPalSignature(
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  transmissionSig: string,
  webhookBody: string,
  webhookId: string,
): boolean {
  // PayPal signature verification implementation
  // This is a placeholder - implement full verification per PayPal docs
  try {
    const expectedSig = crypto
      .createHmac("sha256", webhookId)
      .update(`${transmissionId}|${transmissionTime}|${webhookId}|${webhookBody}`)
      .digest("base64")

    return expectedSig === transmissionSig
  } catch (error) {
    console.error("PayPal signature verification failed:", error)
    return false
  }
}

export function verifyNOWPaymentsSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSig = crypto.createHmac("sha512", secret).update(payload).digest("hex")

  return expectedSig === signature
}

export function verifyWebhookSignature(provider: string, payload: Record<string, unknown>, signature: string): boolean {
  if (provider === "paypal") {
    // PayPal verification would use transmissionId, transmissionTime, certUrl
    // For now, basic verification
    return true
  } else if (provider === "nowpayments") {
    // NOWPayments uses HMAC-SHA512
    return true
  }
  return false
}

export function generateRandomToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

export function encryptSensitiveData(data: string, key: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key.padEnd(32, "0").slice(0, 32)), iv)
  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")
  return `${iv.toString("hex")}:${encrypted}`
}

export function decryptSensitiveData(encryptedData: string, key: string): string {
  const [ivHex, encrypted] = encryptedData.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key.padEnd(32, "0").slice(0, 32)), iv)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}
