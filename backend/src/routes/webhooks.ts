// Webhook routes - handles payment provider webhooks

import express, { type Request, type Response } from "express"
import { OrchestrationService } from "../services/orchestration.service"

const router = express.Router()
const orchestrationService = new OrchestrationService()

// PayPal webhook
router.post("/paypal", async (req: Request, res: Response) => {
  try {
    const payload = req.body

    console.log("[v0] PayPal webhook received:", payload.event_type)

    const result = await orchestrationService.handlePaymentWebhook("paypal", payload)

    console.log("[v0] Webhook processed:", result)

    res.json({ success: true, result })
  } catch (error) {
    console.error("[v0] PayPal webhook error:", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
})

// NOWPayments webhook
router.post("/nowpayments", async (req: Request, res: Response) => {
  try {
    const payload = req.body

    console.log("[v0] NOWPayments webhook received:", payload.payment_status)

    const result = await orchestrationService.handlePaymentWebhook("nowpayments", payload)

    console.log("[v0] Webhook processed:", result)

    res.json({ success: true, result })
  } catch (error) {
    console.error("[v0] NOWPayments webhook error:", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
})

export default router
