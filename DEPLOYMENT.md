# Deployment Guide

## Prerequisites
- Vercel account for frontend
- AWS/GCP account for backend
- PostgreSQL database
- Redis instance

## Frontend Deployment (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Backend API URL

3. Deploy:
\`\`\`bash
vercel deploy --prod
\`\`\`

## Backend Deployment (AWS EC2)

1. Create EC2 instance (Ubuntu 22.04)
2. Install Node.js and dependencies
3. Set up environment variables
4. Configure PostgreSQL and Redis
5. Deploy with PM2:

\`\`\`bash
npm install -g pm2
pm2 start dist/index.js --name "defi-booking-api"
pm2 save
pm2 startup
\`\`\`

## Database Setup

1. Create PostgreSQL database
2. Run migrations:
\`\`\`bash
npm run migrate
\`\`\`

3. Set up backups:
\`\`\`bash
pg_dump -U user -h host dbname > backup.sql
\`\`\`

## Monitoring

- Set up Sentry for error tracking
- Configure CloudWatch for logs
- Set up alerts for payment failures
- Monitor database performance

## SSL/TLS

Use Let's Encrypt for SSL certificates:
\`\`\`bash
certbot certonly --standalone -d api.example.com
\`\`\`

## Scaling

- Use load balancer for multiple backend instances
- Configure Redis cluster for caching
- Set up database read replicas
- Use CDN for static assets
