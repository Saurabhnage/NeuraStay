"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

export default function AdminPage() {
  const [stats] = useState({
    totalBookings: 1250,
    totalRevenue: 125000,
    pendingPayments: 45,
    completedPayments: 1205,
    nftsMinted: 342,
  })

  const [recentBookings] = useState([
    { id: "1", user: "john@example.com", amount: 99.99, status: "completed", date: "2025-01-20" },
    { id: "2", user: "jane@example.com", amount: 49.99, status: "pending", date: "2025-01-20" },
    { id: "3", user: "bob@example.com", amount: 199.99, status: "completed", date: "2025-01-19" },
  ])

  const [paymentMethods] = useState([
    { provider: "PayPal", transactions: 850, volume: 85000 },
    { provider: "NOWPayments", transactions: 320, volume: 32000 },
    { provider: "Crypto Direct", transactions: 35, volume: 8000 },
  ])

  const [nfts] = useState([
    { id: "1", bookingId: "BKG-001", tokenId: "12345", chain: "Polygon", status: "minted", date: "2025-01-20" },
    { id: "2", bookingId: "BKG-002", tokenId: "12346", chain: "Ethereum", status: "minted", date: "2025-01-19" },
    { id: "3", bookingId: "BKG-003", tokenId: "12347", chain: "Polygon", status: "pending", date: "2025-01-18" },
  ])

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-5 mb-8">
          {[
            { label: "Total Bookings", value: stats.totalBookings },
            { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}` },
            { label: "Pending Payments", value: stats.pendingPayments },
            { label: "Completed", value: stats.completedPayments },
            { label: "NFTs Minted", value: stats.nftsMinted },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{booking.user}</p>
                        <p className="text-sm text-slate-600">{booking.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-slate-900">${booking.amount}</span>
                        <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method, idx) => (
                    <div key={idx} className="border-b border-slate-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{method.provider}</p>
                          <p className="text-sm text-slate-600">{method.transactions} transactions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">${method.volume.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">
                            {((method.volume / stats.totalRevenue) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts">
            <Card>
              <CardHeader>
                <CardTitle>NFT Minting Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nfts.map((nft) => (
                    <div key={nft.id} className="border-b border-slate-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Token #{nft.tokenId}</p>
                          <p className="text-sm text-slate-600">Booking: {nft.bookingId}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{nft.chain}</Badge>
                          <Badge variant={nft.status === "minted" ? "default" : "secondary"}>{nft.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" type="text" placeholder="https://api.example.com/webhooks" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" type="password" placeholder="••••••••••••••••" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="nft-enabled">
                    <input type="checkbox" id="nft-enabled" className="mr-2" defaultChecked />
                    Enable NFT Minting
                  </Label>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
