import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, serviceId, checkIn, checkOut, paymentMethod } = body

    // Validate input
    if (!email || !serviceId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create booking record (in production, save to database)
    const bookingId = Math.random().toString(36).substring(7)
    const booking = {
      id: bookingId,
      email,
      serviceId,
      checkIn,
      checkOut,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Store in session/memory for demo (in production, use database)
    console.log("[v0] Created booking:", booking)

    // Return payment URL based on method
    let paymentUrl = ""
    if (paymentMethod === "paypal") {
      paymentUrl = `/api/payments/paypal/init?bookingId=${bookingId}`
    } else if (paymentMethod === "nowpayments") {
      paymentUrl = `/api/payments/nowpayments/init?bookingId=${bookingId}`
    } else {
      paymentUrl = `/payment-confirmation?bookingId=${bookingId}`
    }

    return NextResponse.json({
      success: true,
      bookingId,
      paymentUrl,
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
