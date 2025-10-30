# DeFi Booking Platform

A comprehensive blockchain-based booking platform with integrated payment processing and NFT minting capabilities.

## Features

- **Secure Booking System**: Create and manage bookings with blockchain verification
- **Multi-Payment Support**: PayPal, NOWPayments, and direct crypto payments
- **NFT Certificates**: Mint NFTs for bookings on Polygon, Ethereum, or Solana
- **Admin Dashboard**: Comprehensive management interface for bookings and payments
- **Webhook Integration**: Real-time payment status updates from providers
- **Row-Level Security**: Database-level access control

## Tech Stack

### Frontend
- Next.js 16 with React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js with Express
- PostgreSQL for data storage
- Redis for caching
- TypeScript

### Integrations
- PayPal Commerce Platform
- NOWPayments API
- NFT.storage for IPFS
- Alchemy for blockchain RPC

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd defi-booking-platform
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
cd backend && npm install && cd ..
\`\`\`

3. Set up environment variables
\`\`\`bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
\`\`\`

4. Start services with Docker
\`\`\`bash
docker-compose up -d
\`\`\`

5. Run database migrations
\`\`\`bash
npm run migrate
\`\`\`

6. Start development servers
\`\`\`bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev
\`\`\`

## Environment Variables

See `backend/.env.example` for all required environment variables.

### Critical Variables
- `PAYPAL_CLIENT_ID` - PayPal API credentials
- `PAYPAL_SECRET` - PayPal API secret
- `NOWPAYMENTS_API_KEY` - NOWPayments API key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string

## API Documentation

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/pay` - Initiate payment
- `POST /api/bookings/:id/refund` - Refund booking

### Payments
- `POST /api/payments/initiate` - Start payment process
- `POST /webhooks/paypal` - PayPal webhook handler
- `POST /webhooks/nowpayments` - NOWPayments webhook handler

### NFTs
- `POST /api/nfts/mint` - Mint NFT for booking
- `GET /api/nfts/:bookingId` - Get NFT details
- `POST /api/nfts/:nftId/burn` - Burn NFT

## Deployment

### Vercel (Frontend)
\`\`\`bash
vercel deploy
\`\`\`

### Docker (Backend)
\`\`\`bash
docker build -t defi-booking-backend ./backend
docker run -p 3001:3001 defi-booking-backend
\`\`\`

## Security Considerations

- All sensitive data is encrypted at rest
- Webhook signatures are verified
- Row-level security policies on database
- CORS configured for allowed origins
- Rate limiting on API endpoints
- Input validation on all endpoints

## Testing

\`\`\`bash
npm test
\`\`\`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
