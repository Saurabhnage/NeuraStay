// NFT routes - handles NFT operations

import express, { type Request, type Response } from "express"
import { NFTService } from "../services/nft.service"

const router = express.Router()
const nftService = new NFTService()

// POST /api/nfts/mint - Mint NFT for a booking
router.post("/mint", async (req: Request, res: Response) => {
  try {
    const { bookingId, bookingDetails } = req.body

    if (!bookingId || !bookingDetails) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const nft = await nftService.mintNFT(bookingId, bookingDetails)

    if (!nft) {
      return res.status(400).json({ error: "Failed to mint NFT" })
    }

    res.json({
      success: true,
      nft,
    })
  } catch (error) {
    console.error("[v0] NFT minting error:", error)
    res.status(500).json({ error: "Failed to mint NFT" })
  }
})

// GET /api/nfts/:bookingId - Get NFT for booking
router.get("/:bookingId", async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params
    const nft = await nftService.getNFT(bookingId)

    if (!nft) {
      return res.status(404).json({ error: "NFT not found" })
    }

    res.json({
      success: true,
      nft,
    })
  } catch (error) {
    console.error("[v0] Get NFT error:", error)
    res.status(500).json({ error: "Failed to fetch NFT" })
  }
})

// POST /api/nfts/:nftId/burn - Burn NFT
router.post("/:nftId/burn", async (req: Request, res: Response) => {
  try {
    const { nftId } = req.params
    const success = await nftService.burnNFT(nftId)

    if (!success) {
      return res.status(400).json({ error: "Failed to burn NFT" })
    }

    res.json({ success: true, message: "NFT burned" })
  } catch (error) {
    console.error("[v0] Burn NFT error:", error)
    res.status(500).json({ error: "Failed to burn NFT" })
  }
})

export default router
