// Main backend server entry point

import express from "express"
import cors from "cors"
import { config, validateConfig } from "./config/env"
import bookingsRouter from "./routes/bookings"
import paymentsRouter from "./routes/payments"
import webhooksRouter from "./routes/webhooks"
import nftsRouter from "./routes/nfts"

validateConfig()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// API Routes
app.use("/api/bookings", bookingsRouter)
app.use("/api/payments", paymentsRouter)
app.use("/webhooks", webhooksRouter)
app.use("/api/nfts", nftsRouter)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ error: "Internal server error" })
})

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`)
})
