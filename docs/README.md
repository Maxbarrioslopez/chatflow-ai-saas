# ChatFlow Documentation

Index of technical documentation for the ChatFlow AI SaaS Platform.

## Documents

| Document | Description | Status |
|----------|-------------|--------|
| `architecture.md` | System architecture, multi-tenant flow, AI+RAG flow, workflow engine — with Mermaid diagrams | ✅ Complete |
| `api.md` | API endpoint reference with request/response examples | ✅ Complete |
| `deployment.md` | Deployment guide for production | ✅ Complete |
| `security.md` | Security architecture, threat model, hardening guide | ✅ Complete |
| `README.md` | (This file) Documentation index | ✅ Updated |

## Document Purposes

### architecture.md
- System overview with component diagram (Mermaid)
- Multi-tenant data flow
- AI chat flow with RAG augmentation
- Workflow engine execution flow
- Scaling considerations

### api.md
- All REST endpoints organized by module
- Authentication (JWT Bearer)
- Request/response schemas
- Error response format
- Rate limiting

### deployment.md
- Production environment requirements
- Docker deployment (future)
- Vercel frontend deployment
- Railway / Render backend deployment
- Database migrations
- Environment variables checklist
- Monitoring and logging

### security.md
- Authentication architecture
- Authorization and RBAC
- Data encryption
- API security (CORS, Helmet, rate limiting)
- AI security (prompt injection, sanitization)
- Tenant isolation
- Audit logging
- Production hardening checklist

## Missing / Pending Documents

| Document | Priority | Reason |
|----------|----------|--------|
| `testing.md` | Medium | No test suite exists yet |
| `contributing.md` | Low | Development guidelines are in root README |
| `widget-integration.md` | Low | Widget embed docs needed when widget is connected |
| `changelog.md` | Low | Track versions after first release |
