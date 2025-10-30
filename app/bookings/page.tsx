"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Spinner } from "../../components/ui/spinner"
import { Alert, AlertDescription } from "../../components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"

interface Booking {
  id: string
  title: string
  price: number
  status: "pending" | "paid" | "completed" | "cancelled"
  checkIn: string
  checkOut: string
  createdAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refundingId, setRefundingId] = useState<string | null>(null)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings")
        if (!response.ok) throw new Error("Failed to fetch bookings")
        const data = await response.json()
        setBookings(data.bookings || [])
      } catch (err) {
        setError("Failed to load bookings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleRefund = async () => {
    if (!selectedBooking) return

    setRefundingId(selectedBooking.id)
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}/refund`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to refund booking")

      setBookings(bookings.map((b) => (b.id === selectedBooking.id ? { ...b, status: "cancelled" as const } : b)))
      setShowRefundDialog(false)
    } catch (err) {
      setError("Failed to process refund")
      console.error(err)
    } finally {
      setRefundingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
            <Button asChild>
              <Link href="/checkout">New Booking</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">No bookings yet</p>
              <Button asChild className="mt-4">
                <Link href="/checkout">Create Your First Booking</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{booking.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {booking.checkIn} to {booking.checkOut}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${booking.price.toFixed(2)}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      {booking.status === "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowRefundDialog(true)
                          }}
                          disabled={refundingId === booking.id}
                        >
                          {refundingId === booking.id ? "Processing..." : "Refund"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Refund Dialog */}
      <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to refund this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">{selectedBooking?.title}</p>
            <p className="mt-1 text-sm text-slate-600">${selectedBooking?.price.toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefund} className="bg-red-600 hover:bg-red-700">
              Refund
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
