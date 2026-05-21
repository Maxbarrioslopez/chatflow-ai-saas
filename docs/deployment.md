# Deployment Guide

## Production Architecture

```
                          ┌─────────────┐
                          │   CDN/CDN    │
                          │ (Vercel Edge)│
                          └──────┬──────┘
                                 │
┌─────────────┐        ┌────────┴────────┐        ┌─────────────┐
│   Frontend   │───────▶│   API Gateway   │───────▶│   Backend    │
│  (Vercel)    │        │  (Railway/Render)│       │  (Docker)    │
└─────────────┘        └─────────────────┘        └──────┬──────┘
                                                          │
                                                 ┌────────┴────────┐
                                                 │   PostgreSQL    │
                                                 │  (Railway/RDS)  │
                                                 └─────────────────┘
```

## Deploying Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Configure environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```
4. Deploy

## Deploying Backend (Railway / Render)

1. Connect your repo
2. Set root directory to `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Environment variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=<random-secret>
   OPENAI_API_KEY=sk-...
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

## Deploying Database (Railway / AWS RDS)

1. Provision PostgreSQL 15 instance
2. Run migrations:
   ```bash
   DATABASE_URL=postgresql://... npm run db:migrate:prod
   ```
3. Seed if needed:
   ```bash
   DATABASE_URL=postgresql://... npm run db:seed
   ```

## Docker

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

## CI/CD Pipeline

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## Monitoring

- **Backend logs:** Use structured JSON logging
- **Error tracking:** Sentry integration
- **Uptime:** Health check at `/api/health`
- **Metrics:** Response times, error rates via analytics module
