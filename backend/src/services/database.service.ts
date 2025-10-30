// Database service - handles all database operations

import type { Booking, Payment, NFT, User } from "../types"

export class DatabaseService {
  // In production, this would connect to PostgreSQL
  // For now, using in-memory storage for demo

  private bookings: Map<string, Booking> = new Map()
  private payments: Map<string, Payment> = new Map()
  private nfts: Map<string, NFT> = new Map()
  private users: Map<string, User> = new Map()

  // Booking operations
  async createBooking(booking: Booking): Promise<Booking> {
    this.bookings.set(booking.id, booking)
    return booking
  }

  async getBooking(bookingId: string): Promise<Booking | null> {
    return this.bookings.get(bookingId) || null
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | null> {
    const booking = this.bookings.get(bookingId)
    if (!booking) return null

    const updated = { ...booking, ...updates, updatedAt: new Date() }
    this.bookings.set(bookingId, updated)
    return updated
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((b) => b.userId === userId)
  }

  // Payment operations
  async createPayment(payment: Payment): Promise<Payment> {
    this.payments.set(payment.id, payment)
    return payment
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    return this.payments.get(paymentId) || null
  }

  async getPaymentByBooking(bookingId: string): Promise<Payment | null> {
    const payments = Array.from(this.payments.values()).filter((p) => p.bookingId === bookingId)
    return payments[0] || null
  }

  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<Payment | null> {
    const payment = this.payments.get(paymentId)
    if (!payment) return null

    const updated = { ...payment, ...updates, updatedAt: new Date() }
    this.payments.set(paymentId, updated)
    return updated
  }

  // NFT operations
  async createNFT(nft: NFT): Promise<NFT> {
    this.nfts.set(nft.id, nft)
    return nft
  }

  async getNFTByBooking(bookingId: string): Promise<NFT | null> {
    const nfts = Array.from(this.nfts.values()).filter((n) => n.bookingId === bookingId)
    return nfts[0] || null
  }

  // User operations
  async createUser(user: User): Promise<User> {
    this.users.set(user.id, user)
    return user
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users.values()).filter((u) => u.email === email)
    return users[0] || null
  }
}
