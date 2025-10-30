// PayPal payment provider service

import { config } from "../../config/env"
import type { Payment } from "../../types"
import { verifyWebhookSignature } from "../../utils/crypto"

export class PayPalService {
  private clientId: string
  private secret: string
  private mode: string
  private baseUrl: string
  private webhookId: string

  constructor() {
    this.clientId = config.PAYPAL_CLIENT_ID
    this.secret = config.PAYPAL_SECRET
    this.mode = config.PAYPAL_MODE
    this.webhookId = config.PAYPAL_WEBHOOK_ID
    this.baseUrl = this.mode === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com"
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString("base64")

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] PayPal token error:", error)
      throw new Error("Failed to get PayPal access token")
    }

    const data = (await response.json()) as { access_token: string }
    return data.access_token
  }

  async createPayment(
    bookingId: string,
    amountUsd: number,
    currency: string,
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      const accessToken = await this.getAccessToken()

      const payload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: bookingId,
            amount: {
              currency_code: currency,
              value: amountUsd.toFixed(2),
            },
            description: `Booking ${bookingId}`,
          },
        ],
        payer: {
          email_address: "buyer@example.com",
        },
        application_context: {
          return_url: `${config.FRONTEND_URL}/payment-confirmation?bookingId=${bookingId}&provider=paypal`,
          cancel_url: `${config.FRONTEND_URL}/checkout?bookingId=${bookingId}&cancelled=true`,
          brand_name: "DeFi Bookings",
          locale: "en-US",
          user_action: "PAY_NOW",
        },
      }

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] PayPal order creation error:", error)
        throw new Error("Failed to create PayPal order")
      }

      const data = (await response.json()) as { id: string; links: Array<{ rel: string; href: string }> }
      const approveLink = data.links.find((link) => link.rel === "approve")

      console.log("[v0] PayPal order created:", data.id)

      return {
        paymentId: data.id,
        paymentUrl: approveLink?.href || "",
      }
    } catch (error) {
      console.error("[v0] PayPal createPayment error:", error)
      throw error
    }
  }

  async capturePayment(bookingId: string, orderId: string): Promise<Payment> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] PayPal capture error:", error)
        throw new Error("Failed to capture PayPal payment")
      }

      const data = (await response.json()) as Record<string, unknown>

      console.log("[v0] PayPal payment captured:", orderId)

      return {
        id: `PAY-${Date.now()}`,
        bookingId,
        provider: "paypal",
        providerPaymentId: orderId,
        amountUsd: 0,
        currency: "USD",
        status: "completed",
        capturedAt: new Date(),
        rawResponseJson: data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } catch (error) {
      console.error("[v0] PayPal capturePayment error:", error)
      throw error
    }
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()

      // Get the capture ID from the payment
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch PayPal order")
      }

      const order = (await response.json()) as Record<string, any>
      const captureId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id

      if (!captureId) {
        console.warn("[v0] No capture ID found for refund")
        return false
      }

      // Refund the capture
      const refundResponse = await fetch(`${this.baseUrl}/v2/payments/captures/${captureId}/refund`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!refundResponse.ok) {
        const error = await refundResponse.text()
        console.error("[v0] PayPal refund error:", error)
        return false
      }

      console.log("[v0] PayPal payment refunded:", paymentId)
      return true
    } catch (error) {
      console.error("[v0] PayPal refundPayment error:", error)
      return false
    }
  }

  async verifyWebhook(payload: Record<string, unknown>, signature: string): Promise<boolean> {
    // Verify PayPal webhook signature
    return verifyWebhookSignature("paypal", payload, signature)
  }
}
