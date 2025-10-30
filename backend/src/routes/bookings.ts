// Booking API routes

import { Router, type Request, type Response } from "express"
import { BookingService } from "../services/booking.service"
import { OrchestrationService } from "../services/orchestration.service"
import { DatabaseService } from "../services/database.service"

const router = Router()
const bookingService = new BookingService()
const orchestrationService = new OrchestrationService()
const dbService = new DatabaseService()

// POST /api/bookings - Create a new booking
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, userEmail, merchantId, serviceId, priceUSD, checkIn, checkOut, walletAddress } = req.body

    // Validate input
    if (!userId || !merchantId || !serviceId || !priceUSD) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const result = await bookingService.createBooking(
      userId,
      serviceId,
      merchantId,
      priceUSD,
      new Date(checkIn),
      new Date(checkOut),
      walletAddress,
    )

    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating booking:", error)
    res.status(500).json({ error: "Failed to create booking" })
  }
})

router.post("/:id/pay", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { provider, amount } = req.body

    if (!provider || !amount) {
      return res.status(400).json({ error: "Missing provider or amount" })
    }

    const { paymentUrl, paymentId } = await orchestrationService.processBookingPayment(id, provider, amount)

    res.json({
      success: true,
      paymentUrl,
      paymentId,
    })
  } catch (error) {
    console.error("Error initiating payment:", error)
    res.status(500).json({ error: "Failed to initiate payment" })
  }
})

// GET /api/bookings/:id - Get booking details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const booking = await bookingService.getBooking(id)

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    res.status(500).json({ error: "Failed to fetch booking" })
  }
})

// POST /api/bookings/:id/cancel - Cancel a booking
router.post("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const success = await bookingService.cancelBooking(id)

    if (!success) {
      return res.status(400).json({ error: "Failed to cancel booking" })
    }

    res.json({ success: true, message: "Booking cancelled" })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    res.status(500).json({ error: "Failed to cancel booking" })
  }
})

router.post("/:id/refund", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const success = await orchestrationService.refundBooking(id)

    if (!success) {
      return res.status(400).json({ error: "Failed to refund booking" })
    }

    res.json({ success: true, message: "Booking refunded" })
  } catch (error) {
    console.error("Error refunding booking:", error)
    res.status(500).json({ error: "Failed to refund booking" })
  }
})

export default router
