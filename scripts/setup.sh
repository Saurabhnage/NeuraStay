#!/bin/bash

# DeFi Booking Platform Setup Script

echo "Setting up DeFi Booking Platform..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Error: Node.js 18+ required"
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install
cd backend && npm install && cd ..

# Create environment files
echo "Creating environment files..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env - please update with your credentials"
fi

# Create database
echo "Setting up database..."
docker-compose up -d postgres redis

# Wait for database
sleep 5

# Run migrations
echo "Running migrations..."
npm run migrate

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your API credentials"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Visit http://localhost:3000 for frontend"
echo "4. API available at http://localhost:3001"
