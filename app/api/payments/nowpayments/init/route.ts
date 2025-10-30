import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId")

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 })
    }

    // In production, initialize NOWPayments payment
    // For now, redirect to confirmation page
    const confirmationUrl = `/payment-confirmation?bookingId=${bookingId}&provider=nowpayments`

    return NextResponse.redirect(confirmationUrl)
  } catch (error) {
    console.error("NOWPayments init error:", error)
    return NextResponse.json({ error: "Failed to initialize NOWPayments payment" }, { status: 500 })
  }
}
