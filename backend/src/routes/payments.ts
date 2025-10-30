// Payment routes - handles payment initiation and webhooks

import express, { type Request, type Response } from "express"
import { PaymentService } from "../services/payment.service"
import { DatabaseService } from "../services/database.service"

const router = express.Router()
const paymentService = new PaymentService()
const dbService = new DatabaseService()

// Initiate payment
router.post("/initiate", async (req: Request, res: Response) => {
  try {
    const { bookingId, provider, amountUsd, currency } = req.body

    if (!bookingId || !provider || !amountUsd) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const { paymentUrl, paymentId } = await paymentService.initiatePayment(
      bookingId,
      provider,
      amountUsd,
      currency || "USD",
    )

    res.json({
      success: true,
      paymentUrl,
      paymentId,
    })
  } catch (error) {
    console.error("Payment initiation error:", error)
    res.status(500).json({ error: "Failed to initiate payment" })
  }
})

// PayPal webhook
router.post("/webhooks/paypal", async (req: Request, res: Response) => {
  try {
    const { id, event_type, resource } = req.body

    console.log(`[v0] PayPal webhook received: ${event_type}`)

    if (event_type === "CHECKOUT.ORDER.COMPLETED") {
      const orderId = resource.id
      const bookingId = resource.purchase_units?.[0]?.reference_id

      if (bookingId) {
        // Update booking status
        await dbService.updateBooking(bookingId, { status: "paid" })
      }
    }

    res.json({ success: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
})

// NOWPayments webhook
router.post("/webhooks/nowpayments", async (req: Request, res: Response) => {
  try {
    const { payment_id, order_id, payment_status } = req.body

    console.log(`[v0] NOWPayments webhook received: ${payment_status}`)

    if (payment_status === "finished") {
      // Update booking status
      await dbService.updateBooking(order_id, { status: "paid" })
    }

    res.json({ success: true })
  } catch (error) {
    console.error("NOWPayments webhook error:", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
})

// Get payment status
router.get("/:paymentId", async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params
    const payment = await dbService.getPayment(paymentId)

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    res.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Get payment error:", error)
    res.status(500).json({ error: "Failed to fetch payment" })
  }
})

export default router
