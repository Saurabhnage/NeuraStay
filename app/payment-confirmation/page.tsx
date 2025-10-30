"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Spinner } from "../../components/ui/spinner"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const provider = searchParams.get("provider") || "unknown"

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <CardTitle>Payment Initiated</CardTitle>
            <CardDescription>Your booking is being processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              <p className="text-slate-600">
                Payment method: <span className="font-semibold text-slate-900 capitalize">{provider}</span>
              </p>
              <p className="text-slate-600">You'll receive a confirmation email shortly with your booking details.</p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/bookings">View My Bookings</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
