// Payment orchestration service - handles all payment providers

import type { Payment } from "../types"
import { PayPalService } from "./providers/paypal.service"
import { NOWPaymentsService } from "./providers/nowpayments.service"

export class PaymentService {
  private paypalService: PayPalService
  private nowpaymentsService: NOWPaymentsService

  constructor() {
    this.paypalService = new PayPalService()
    this.nowpaymentsService = new NOWPaymentsService()
  }

  async initiatePayment(
    bookingId: string,
    provider: "paypal" | "nowpayments",
    amountUsd: number,
    currency = "USD",
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    if (provider === "paypal") {
      return this.paypalService.createPayment(bookingId, amountUsd, currency)
    } else if (provider === "nowpayments") {
      return this.nowpaymentsService.createPayment(bookingId, amountUsd, currency)
    }

    throw new Error(`Unsupported payment provider: ${provider}`)
  }

  async capturePayment(bookingId: string, provider: string, providerPaymentId: string): Promise<Payment> {
    if (provider === "paypal") {
      return this.paypalService.capturePayment(bookingId, providerPaymentId)
    } else if (provider === "nowpayments") {
      return this.nowpaymentsService.capturePayment(bookingId, providerPaymentId)
    }

    throw new Error(`Unsupported payment provider: ${provider}`)
  }

  async refundPayment(paymentId: string, provider: string): Promise<boolean> {
    if (provider === "paypal") {
      return this.paypalService.refundPayment(paymentId)
    } else if (provider === "nowpayments") {
      return this.nowpaymentsService.refundPayment(paymentId)
    }

    throw new Error(`Unsupported payment provider: ${provider}`)
  }

  async verifyWebhook(provider: string, payload: Record<string, unknown>, signature: string): Promise<boolean> {
    if (provider === "paypal") {
      return this.paypalService.verifyWebhook(payload, signature)
    } else if (provider === "nowpayments") {
      return this.nowpaymentsService.verifyWebhook(payload, signature)
    }

    return false
  }
}
