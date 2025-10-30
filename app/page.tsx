"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function Home() {
  const [services] = useState([
    {
      id: "1",
      title: "Premium Booking",
      description: "Book premium services with instant confirmation",
      price: 99.99,
      features: ["Instant confirmation", "Flexible cancellation", "Priority support"],
    },
    {
      id: "2",
      title: "Standard Booking",
      description: "Reliable booking service with standard features",
      price: 49.99,
      features: ["24h confirmation", "Standard support", "Booking history"],
    },
    {
      id: "3",
      title: "NFT Booking Pass",
      description: "Exclusive NFT-backed booking with collectible benefits",
      price: 199.99,
      features: ["NFT certificate", "Lifetime access", "VIP support", "Resellable"],
    },
  ])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">DeFi Bookings</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/bookings" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                My Bookings
              </Link>
              <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Admin
              </Link>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Book with Confidence</h2>
          <p className="mt-4 text-lg text-slate-600">
            Secure, transparent bookings powered by blockchain technology and multiple payment options
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/checkout">Start Booking</Link>
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="mb-12 text-center text-3xl font-bold text-slate-900">Our Services</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">${service.price}</span>
                  <span className="text-sm text-slate-600">/booking</span>
                </div>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href={`/checkout?service=${service.id}`}>Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="mb-12 text-center text-3xl font-bold text-slate-900">Why Choose Us</h3>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { title: "Secure", desc: "Blockchain-verified transactions" },
              { title: "Fast", desc: "Instant payment confirmation" },
              { title: "Flexible", desc: "Multiple payment options" },
              { title: "Transparent", desc: "Complete transaction history" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100" />
                </div>
                <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-600 sm:px-6 lg:px-8">
          <p>&copy; 2025 DeFi Bookings. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
