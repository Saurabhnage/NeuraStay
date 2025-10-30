// NOWPayments payment provider service

import { config } from "../../config/env"
import type { Payment } from "../../types"
import { verifyNOWPaymentsSignature } from "../../utils/crypto"

export class NOWPaymentsService {
  private apiKey: string
  private ipnSecret: string
  private baseUrl = "https://api.nowpayments.io/v1"

  constructor() {
    this.apiKey = config.NOWPAYMENTS_API_KEY
    this.ipnSecret = config.NOWPAYMENTS_IPN_SECRET
  }

  async createPayment(
    bookingId: string,
    amountUsd: number,
    currency: string,
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      const payload = {
        price_amount: amountUsd,
        price_currency: currency,
        pay_currency: "USDT",
        order_id: bookingId,
        order_description: `Booking ${bookingId}`,
        ipn_callback_url: `${config.API_URL}/webhooks/nowpayments`,
        success_url: `${config.FRONTEND_URL}/payment-confirmation?bookingId=${bookingId}&provider=nowpayments`,
        cancel_url: `${config.FRONTEND_URL}/checkout?bookingId=${bookingId}&cancelled=true`,
      }

      const response = await fetch(`${this.baseUrl}/payment`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] NOWPayments creation error:", error)
        throw new Error("Failed to create NOWPayments payment")
      }

      const data = (await response.json()) as { payment_id: string; payment_url: string }

      console.log("[v0] NOWPayments payment created:", data.payment_id)

      return {
        paymentId: data.payment_id.toString(),
        paymentUrl: data.payment_url,
      }
    } catch (error) {
      console.error("[v0] NOWPayments createPayment error:", error)
      throw error
    }
  }

  async capturePayment(bookingId: string, paymentId: string): Promise<Payment> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/${paymentId}`, {
        method: "GET",
        headers: {
          "x-api-key": this.apiKey,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] NOWPayments fetch error:", error)
        throw new Error("Failed to fetch NOWPayments payment status")
      }

      const data = (await response.json()) as Record<string, unknown>

      console.log("[v0] NOWPayments payment captured:", paymentId)

      return {
        id: `PAY-${Date.now()}`,
        bookingId,
        provider: "nowpayments",
        providerPaymentId: paymentId,
        amountUsd: 0,
        currency: "USD",
        status: "completed",
        capturedAt: new Date(),
        rawResponseJson: data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } catch (error) {
      console.error("[v0] NOWPayments capturePayment error:", error)
      throw error
    }
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    // NOWPayments doesn't support direct refunds through API
    // Refunds are handled manually through dashboard
    console.log("[v0] Manual refund required for NOWPayments payment:", paymentId)
    return true
  }

  async verifyWebhook(payload: Record<string, unknown>, signature: string): Promise<boolean> {
    // Verify NOWPayments webhook signature using HMAC-SHA512
    const payloadString = JSON.stringify(payload)
    return verifyNOWPaymentsSignature(payloadString, signature as string, this.ipnSecret)
  }
}
