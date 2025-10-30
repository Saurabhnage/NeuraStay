"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Spinner } from "../../components/ui/spinner"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service") || "1"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("paypal")

  const serviceDetails: Record<string, any> = {
    "1": { title: "Premium Booking", price: 99.99 },
    "2": { title: "Standard Booking", price: 49.99 },
    "3": { title: "NFT Booking Pass", price: 199.99 },
  }

  const service = serviceDetails[serviceId] || serviceDetails["1"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate dates
      if (new Date(checkOut) <= new Date(checkIn)) {
        throw new Error("Check-out date must be after check-in date")
      }

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          serviceId,
          checkIn,
          checkOut,
          paymentMethod,
          amount: service.price,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const data = await response.json()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      console.error("Booking error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Complete Your Booking</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Enter your information and select a payment method</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="checkin">Check-in Date</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout">Check-out Date</Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label className="mb-3 block">Payment Method</Label>
                    <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="paypal">PayPal</TabsTrigger>
                        <TabsTrigger value="nowpayments">NOWPayments</TabsTrigger>
                        <TabsTrigger value="crypto">Crypto</TabsTrigger>
                      </TabsList>

                      <TabsContent value="paypal" className="mt-4">
                        <Alert>
                          <AlertDescription>
                            Pay securely with PayPal. You'll be redirected to PayPal to complete payment.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>

                      <TabsContent value="nowpayments" className="mt-4">
                        <Alert>
                          <AlertDescription>
                            Pay with crypto or fiat through NOWPayments. Multiple currencies supported.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>

                      <TabsContent value="crypto" className="mt-4">
                        <Alert>
                          <AlertDescription>
                            Direct crypto payment. Send to the address provided after booking confirmation.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Service</p>
                  <p className="font-semibold text-slate-900">{service.title}</p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-900">${service.price.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm text-slate-600">Fees</span>
                    <span className="font-medium text-slate-900">$0.00</span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">${service.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                  <p>✓ Secure payment processing</p>
                  <p>✓ Instant confirmation</p>
                  <p>✓ 24/7 customer support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
