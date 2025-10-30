// Payment orchestration service - coordinates payment flow and state management

import { PaymentService } from "./payment.service"
import { DatabaseService } from "./database.service"
import type { Booking, Payment } from "../types"

export class OrchestrationService {
  private paymentService: PaymentService
  private dbService: DatabaseService

  constructor() {
    this.paymentService = new PaymentService()
    this.dbService = new DatabaseService()
  }

  async processBookingPayment(
    bookingId: string,
    provider: "paypal" | "nowpayments",
    amountUsd: number,
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    // Validate booking exists
    const booking = await this.dbService.getBooking(bookingId)
    if (!booking) {
      throw new Error("Booking not found")
    }

    // Check if payment already exists
    const existingPayment = await this.dbService.getPaymentByBooking(bookingId)
    if (existingPayment && existingPayment.status === "completed") {
      throw new Error("Booking already paid")
    }

    // Initiate payment with provider
    const { paymentUrl, paymentId } = await this.paymentService.initiatePayment(bookingId, provider, amountUsd)

    // Create payment record
    const payment: Payment = {
      id: `PAY-${Date.now()}`,
      bookingId,
      provider,
      providerPaymentId: paymentId,
      amountUsd,
      currency: "USD",
      status: "pending",
      rawResponseJson: { paymentUrl },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.dbService.createPayment(payment)

    return { paymentUrl, paymentId }
  }

  async handlePaymentWebhook(
    provider: string,
    payload: Record<string, unknown>,
  ): Promise<{ bookingId: string; status: string }> {
    let bookingId: string | undefined
    let paymentStatus: string | undefined

    if (provider === "paypal") {
      const eventType = payload.event_type as string
      if (eventType === "CHECKOUT.ORDER.COMPLETED") {
        const resource = payload.resource as Record<string, any>
        bookingId = resource.purchase_units?.[0]?.reference_id
        paymentStatus = "completed"
      }
    } else if (provider === "nowpayments") {
      bookingId = payload.order_id as string
      const status = payload.payment_status as string
      paymentStatus = status === "finished" ? "completed" : "pending"
    }

    if (!bookingId) {
      throw new Error("Could not extract booking ID from webhook")
    }

    // Update booking status
    await this.dbService.updateBooking(bookingId, {
      status: paymentStatus as "pending" | "paid" | "cancelled" | "completed",
    })

    return { bookingId, status: paymentStatus || "unknown" }
  }

  async refundBooking(bookingId: string): Promise<boolean> {
    const booking = await this.dbService.getBooking(bookingId)
    if (!booking) {
      throw new Error("Booking not found")
    }

    const payment = await this.dbService.getPaymentByBooking(bookingId)
    if (!payment) {
      throw new Error("No payment found for booking")
    }

    // Process refund
    const refunded = await this.paymentService.refundPayment(payment.id, payment.provider)

    if (refunded) {
      await this.dbService.updatePayment(payment.id, { status: "refunded" })
      await this.dbService.updateBooking(bookingId, { status: "cancelled" })
    }

    return refunded
  }

  async getBookingWithPayment(bookingId: string): Promise<{ booking: Booking | null; payment: Payment | null }> {
    const booking = await this.dbService.getBooking(bookingId)
    const payment = booking ? await this.dbService.getPaymentByBooking(bookingId) : null

    return { booking, payment }
  }
}
