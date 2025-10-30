// NOWPayments payment callback handler

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_id, order_id, payment_status } = body

    console.log("[v0] NOWPayments callback received:", { payment_id, order_id, payment_status })

    // Verify webhook signature
    const signature = request.headers.get("x-nowpayments-sig")
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    // In production, verify the signature and update payment status
    if (payment_status === "finished") {
      console.log("[v0] Payment completed:", order_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] NOWPayments callback error:", error)
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 })
  }
}
