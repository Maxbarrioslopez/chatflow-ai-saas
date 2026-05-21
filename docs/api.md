# API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@acme.com",
  "password": "SecurePass123",
  "organizationName": "Acme Corp"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@acme.com",
  "password": "SecurePass123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJ..."
}
```

## Chatbots

All chatbot endpoints require authentication (Bearer token).

### List Chatbots
```http
GET /chatbots
Authorization: Bearer <token>
```

### Create Chatbot
```http
POST /chatbots
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Support Bot",
  "description": "Customer support assistant",
  "businessPreset": "support"
}
```

### Get Chatbot
```http
GET /chatbots/:id
Authorization: Bearer <token>
```

### Update Appearance
```http
PUT /chatbots/:id/appearance
Authorization: Bearer <token>
Content-Type: application/json

{
  "primaryColor": "#6366f1",
  "theme": "light",
  "position": "right"
}
```

### Update Behavior
```http
PUT /chatbots/:id/behavior
Authorization: Bearer <token>
Content-Type: application/json

{
  "initialMessage": "Hello! How can I help?",
  "suggestedMessages": ["Help", "Pricing"],
  "collectLeadInfo": true
}
```

### Update AI Config
```http
PUT /chatbots/:id/ai-config
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "systemPrompt": "You are a helpful assistant..."
}
```

## Chat (Public)

These endpoints don't require authentication (use widget token).

### Get Widget Config
```http
GET /chat/widget/:widgetToken
```

### Send Message
```http
POST /chat/send
Content-Type: application/json

{
  "chatbotId": "abc123",
  "message": "Hello!",
  "conversationId": "conv_123",
  "visitorId": "visitor_abc"
}
```

## Conversations

Requires authentication.

```http
GET /conversations?status=active&chatbotId=abc123&limit=50&offset=0
PATCH /conversations/:id/status  { "status": "resolved" }
POST /conversations/:id/rating   { "rating": 5, "feedback": "Great!" }
GET /conversations/:id/messages
```

## Leads

Requires authentication.

```http
GET /leads?status=new&chatbotId=abc123&search=john&limit=50&offset=0
PATCH /leads/:id/status  { "status": "qualified" }
PATCH /leads/:id/score   { "score": 85 }
POST /leads/:id/tags     { "tags": ["vip", "hot"] }
DELETE /leads/:id/tags   { "tags": ["vip"] }
```

## Analytics

Requires authentication.

```http
GET /analytics/dashboard?period=7d
GET /analytics/conversations
GET /analytics/leads
GET /analytics/satisfaction
GET /analytics/chatbot/:chatbotId
```

## Error Format

```json
{
  "error": {
    "message": "Description of the error",
    "statusCode": 400
  }
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limited |
| 500 | Internal Server Error |
