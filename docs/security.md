# Security Documentation

## Overview

ChatFlow follows security best practices for SaaS applications. All sensitive operations are centralized in the backend.

## Authentication & Authorization

### JWT Tokens
- Access tokens expire after 7 days (configurable)
- Refresh tokens last 30 days
- Tokens are signed with a server-side secret
- No token logic in frontend code

### Password Policy
- Minimum 8 characters
- Requires uppercase letter and number
- Hashed with bcryptjs (12 salt rounds)
- No plain-text storage

### Role-Based Access Control
| Role | Permissions |
|------|-------------|
| Owner | Full access, billing, team management |
| Admin | CRUD chatbots, view analytics, manage team |
| Member | Manage assigned chatbots, view conversations |
| Viewer | Read-only access to dashboards |

## API Security

### Headers
- Helmet.js for security headers
- CORS restricted to frontend origin
- Content-Type validation

### Rate Limiting
- 100 requests per 15 minutes per IP
- Separate limits for auth endpoints
- Configurable in `backend/src/config`

### Input Validation
- Zod schemas validate all inputs
- SQL injection prevention via Prisma ORM
- XSS protection via React's built-in escaping

## Data Protection

### Secrets Management
- No API keys in frontend
- Environment variables for all secrets
- `.env` files in `.gitignore`
- Never commit credentials

### Database
- PostgreSQL with SSL in production
- Connection pooling
- Prepared statements via Prisma
- No raw SQL

## Chat Widget Security

### Widget Token
- Unique token per chatbot
- Can be regenerated at any time
- No JWT required for visitor messages
- Rate limited per visitor session

### Visitor Privacy
- No mandatory personal data collection
- Opt-in lead capture
- Configurable data retention
- IP address anonymization option

## Compliance

### Data Retention
- Conversation history configurable
- Lead data deletable on demand
- Audit logs for all admin actions

### Audit Trail
- All CRUD operations logged
- User actions tracked with metadata
- IP address logging for security events
