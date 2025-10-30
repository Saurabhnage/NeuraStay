import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database based on authenticated user
    const mockBookings = [
      {
        id: "1",
        title: "Premium Booking",
        price: 99.99,
        status: "completed" as const,
        checkIn: "2025-01-15",
        checkOut: "2025-01-20",
        createdAt: "2025-01-10",
      },
      {
        id: "2",
        title: "Standard Booking",
        price: 49.99,
        status: "paid" as const,
        checkIn: "2025-02-01",
        checkOut: "2025-02-05",
        createdAt: "2025-01-20",
      },
    ]

    return NextResponse.json({
      success: true,
      bookings: mockBookings,
    })
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
