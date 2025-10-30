// PayPal payment callback handler

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")
    const payerId = request.nextUrl.searchParams.get("PayerID")

    if (!token) {
      return NextResponse.redirect(new URL("/checkout?error=missing_token", request.url))
    }

    // In production, verify the token with PayPal and capture the payment
    console.log("[v0] PayPal callback received:", { token, payerId })

    // Redirect to confirmation page
    return NextResponse.redirect(new URL(`/payment-confirmation?bookingId=${token}&provider=paypal`, request.url))
  } catch (error) {
    console.error("[v0] PayPal callback error:", error)
    return NextResponse.redirect(new URL("/checkout?error=callback_failed", request.url))
  }
}
