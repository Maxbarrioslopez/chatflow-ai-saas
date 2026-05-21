# Moderation System

Configurable content filtering for chatbot conversations. Supports forbidden words, phrases, regex patterns, sensitive data detection, and prompt injection guard.

## Architecture

```
Message → Moderation Check → [BLOCK | WARN | MASK | HANDOFF | LOG] → AI
```

### Components

1. **ModerationRule** — DB model storing configurable rules per organization/chatbot
2. **Detector** (`backend/src/services/moderation/detector.ts`) — Pattern matching, sensitive data detection, prompt injection detection
3. **Service** (`backend/src/services/moderation/index.ts`) — Orchestrates rule evaluation and event logging
4. **API** (`backend/src/modules/moderation/`) — REST endpoints for CRUD + test
5. **UI** (`frontend/src/components/moderation/moderation-panel.tsx`) — Rule management in chatbot detail

## Models

### ModerationRule

| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| organizationId | String | Tenant scope |
| chatbotId | String? | Bot scope (null = org-wide) |
| type | Enum | FORBIDDEN_WORD, FORBIDDEN_PHRASE, REGEX_PATTERN, SENSITIVE_DATA, PROMPT_INJECTION, CUSTOM |
| value | String | The word, phrase, or regex pattern |
| action | Enum | BLOCK_MESSAGE, WARN_USER, HUMAN_HANDOFF, MASK_CONTENT, LOG_ONLY |
| severity | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| enabled | Boolean | Toggle without deleting |
| matchMode | Enum | EXACT, CONTAINS, REGEX, STARTS_WITH, ENDS_WITH |
| caseSensitive | Boolean | Default false |

### ModerationEvent

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| matchedValue | String? | What was matched (truncated to 200 chars) |
| maskedPreview | String? | Masked version if applicable |
| createdAt | DateTime | When the event occurred |

## Actions

| Action | Effect |
|--------|--------|
| BLOCK_MESSAGE | Message is rejected with a blocked message response |
| WARN_USER | Warning is sent but conversation continues |
| HUMAN_HANDOFF | Conversation is routed to a human agent |
| MASK_CONTENT | Sensitive parts are masked, rest proceeds to AI |
| LOG_ONLY | Rule violation is logged, no user-facing effect |

## Sensitive Data Detection

Detects and optionally masks:

- Email addresses (`user@domain.com` → `u***@domain.com`)
- Phone numbers (`+56912345678` → `+56*****678`)
- Chilean RUT (`12.345.678-9` → `12.***.***-9`)
- Credit card numbers (`****1234`)
- JWT tokens (`eyJ****[truncated]`)
- API keys (`sk-****abcd`)

## Prompt Injection Detection

Detects phrases in English and Spanish attempting to override system instructions:

- "ignore all previous instructions"
- "olvida las instrucciones anteriores"
- "reveal your system prompt"
- "jailbreak", "bypass"
- "act as if you have no rules"
- "developer message", etc.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/moderation/:chatbotId/rules` | List rules |
| POST | `/api/moderation/:chatbotId/rules` | Create rule |
| PATCH | `/api/moderation/:chatbotId/rules/:ruleId` | Update rule |
| DELETE | `/api/moderation/:chatbotId/rules/:ruleId` | Delete rule |
| POST | `/api/moderation/:chatbotId/rules/bulk` | Bulk import (skips duplicates) |
| POST | `/api/moderation/:chatbotId/rules/test` | Test text against rules |
| GET | `/api/moderation/:chatbotId/events` | Recent moderation events |

All endpoints require authentication and organization-scoped access.

## UI

Located in the chatbot detail page under the "Moderation" tab:

- List view with enabled/disabled toggle per rule
- Create rule form (type, value, action, severity, match mode, case sensitivity)
- Bulk import (one term per line)
- Test panel (test any text against current rules)
- Events view (recent moderation triggers)

## Chat Integration

Before any message is sent to the AI:

1. User message is checked against all enabled rules
2. If `BLOCK_MESSAGE` action matches → user receives "content not allowed" response
3. If `MASK_CONTENT` → sensitive data is masked before sending to AI
4. All rule matches are logged as ModerationEvent
5. If no blocking rules match → message proceeds to RAG + AI as normal

## Privacy

- Matched values are truncated to 200 characters in logs
- Full message content is not stored in moderation events
- API keys and tokens are masked before storage
- Audit trail preserves what rule was triggered, not the full user message

## Limitations

1. **No ML-based detection** — Rules are exact/regex based only
2. **No false positive tuning** — All matching rules are applied, no confidence threshold
3. **No rate limiting per rule** — All rules are checked for every message
4. **Regex validation** — Invalid regex patterns silently fail (no match)
