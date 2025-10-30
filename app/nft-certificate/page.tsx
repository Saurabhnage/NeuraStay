// NFT certificate display page

"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Spinner } from "../../components/ui/spinner"

function NFTCertificateContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const nftData = {
    tokenId: "12345",
    chain: "Polygon",
    contractAddress: "0x1234...5678",
    tokenUri: "ipfs://QmXxxx",
    mintDate: new Date().toLocaleDateString(),
    bookingDetails: {
      title: "Premium Booking",
      price: 99.99,
      checkIn: "2025-01-15",
      checkOut: "2025-01-20",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Your NFT Certificate</h1>
          <p className="mt-2 text-slate-600">Your booking has been minted as an NFT</p>
        </div>

        {/* NFT Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            <div className="text-center text-white">
              <div className="mb-4 text-6xl">🎫</div>
              <h2 className="text-2xl font-bold">{nftData.bookingDetails.title}</h2>
              <p className="mt-2 text-blue-100">NFT Certificate</p>
            </div>
          </div>

          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Booking Details */}
              <div>
                <h3 className="font-semibold text-slate-900">Booking Details</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service</span>
                    <span className="font-medium text-slate-900">{nftData.bookingDetails.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price</span>
                    <span className="font-medium text-slate-900">${nftData.bookingDetails.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Check-in</span>
                    <span className="font-medium text-slate-900">{nftData.bookingDetails.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Check-out</span>
                    <span className="font-medium text-slate-900">{nftData.bookingDetails.checkOut}</span>
                  </div>
                </div>
              </div>

              {/* NFT Details */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900">NFT Details</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Token ID</span>
                    <span className="font-mono font-medium text-slate-900">{nftData.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Chain</span>
                    <Badge>{nftData.chain}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Contract</span>
                    <span className="font-mono text-xs font-medium text-slate-900">{nftData.contractAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Minted</span>
                    <span className="font-medium text-slate-900">{nftData.mintDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" asChild>
                    <a
                      href={`https://polygonscan.com/token/${nftData.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Explorer
                    </a>
                  </Button>
                  <Button asChild>
                    <Link href="/bookings">Back to Bookings</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About Your NFT</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>
              Your booking has been minted as an NFT on the {nftData.chain} blockchain. This certificate proves your
              booking and can be transferred or sold on NFT marketplaces. Keep your private keys safe!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function NFTCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <NFTCertificateContent />
    </Suspense>
  )
}
