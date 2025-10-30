# Security Policy

## Data Protection

- All sensitive data encrypted with AES-256
- Passwords hashed with bcrypt
- API keys stored in environment variables
- Database credentials never committed to repo

## API Security

- CORS configured for allowed origins
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection prevention via parameterized queries
- XSS protection via Content Security Policy

## Payment Security

- PCI DSS compliance for payment handling
- Webhook signature verification
- Secure token storage
- Payment data never logged

## Blockchain Security

- Private keys stored in secure KMS
- NFT metadata validated before minting
- Smart contract audited
- Testnet for development

## Incident Response

1. Identify and isolate affected systems
2. Notify affected users
3. Implement fix
4. Deploy patch
5. Post-incident review

## Reporting Security Issues

Email security@example.com with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

Do not disclose publicly until patched.
