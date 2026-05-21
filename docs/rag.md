# RAG Pipeline

Real embedding-based Retrieval-Augmented Generation for ChatMBL chatbots.

## Architecture

```
Upload → Validate → Queue (BullMQ) → Parse → Chunk → Embed → Store → Search → Augment → Respond
```

### Flow

1. **Upload**: User uploads PDF/DOCX/TXT/MD/CSV via frontend or API
2. **Validate**: Backend validates MIME type, extension, file size
3. **Queue**: Job added to BullMQ `document-parsing` queue (requires Redis)
4. **Parse**: File parsed by specialized parser per type:
   - PDF → `unpdf` (text extraction)
   - DOCX → `mammoth` (raw text)
   - CSV → `papaparse` (rows to semantic text)
   - TXT/MD → Direct UTF-8 text
   - HTML/URL → `cheerio` (strip tags, extract content)
5. **Chunk**: Text split by LangChain `RecursiveCharacterTextSplitter` (configurable chunk size/overlap)
6. **Embed**: Each chunk vectorized via OpenAI `text-embedding-3-small`
7. **Store**: Embeddings saved in PostgreSQL via pgvector
8. **Search**: User message embedded, cosine similarity search against stored vectors
9. **Augment**: Retrieved context injected into system prompt
10. **Respond**: AI generates answer with context

## Upload Endpoints

### POST `/api/knowledge/:chatbotId/documents`
Upload a file. Multipart form with field `file`.

### POST `/api/knowledge/:chatbotId/text`
Add text content as a knowledge source.

### GET `/api/knowledge/:chatbotId/sources`
List all knowledge sources for a chatbot.

### GET `/api/knowledge/:chatbotId/sources/:sourceId`
Get knowledge source details.

### DELETE `/api/knowledge/:chatbotId/sources/:sourceId`
Delete knowledge source and its embeddings.

### POST `/api/knowledge/:chatbotId/sources/:sourceId/reprocess`
Re-process a failed source.

### POST `/api/knowledge/:chatbotId/search`
Semantic search within a chatbot's knowledge base.

### GET `/api/knowledge/:chatbotId/stats`
Get processing statistics.

## Source Statuses

| Status | Description |
|--------|-------------|
| `pending` | Queued for processing |
| `processing` | Being parsed, chunked, and embedded |
| `ready` | Fully processed and searchable |
| `failed` | Processing error (check `errorMessage`) |
| `needs_ocr` | PDF has no extractable text; OCR required |

## File Types

| Extension | Parser | Notes |
|-----------|--------|-------|
| `.pdf` | unpdf | Text extraction; scanned PDFs marked as `needs_ocr` |
| `.docx` | mammoth | Raw text extraction |
| `.txt` | Native | Direct UTF-8 |
| `.md` | Native | Direct UTF-8 |
| `.csv` | papaparse | Converted to semantic text rows |

Maximum file size: 10MB (configurable via `MAX_UPLOAD_SIZE_MB`)

## Chunking

- **Tool**: LangChain `RecursiveCharacterTextSplitter`
- **Default chunk size**: 1000 characters (configurable: `DOCUMENT_CHUNK_SIZE`)
- **Default overlap**: 150 characters (configurable: `DOCUMENT_CHUNK_OVERLAP`)
- **Separators**: `\n\n`, `\n`, `.`, `!`, `?`, `,`, ` `
- **Fallback**: If LangChain is unavailable, uses paragraph-based manual chunking

## Embeddings

- **Provider**: OpenAI
- **Model**: `text-embedding-3-small` (configurable: `EMBEDDING_MODEL`)
- **Dimensions**: 1536
- **Storage**: PostgreSQL with pgvector extension
- **Search**: Cosine similarity (`<=>` operator)
- **Fallback**: If pgvector is unavailable, returns chunks by recency (no ranking)

## Chat Integration

When a user sends a message via `POST /api/chat/send`:

1. The last user message is extracted
2. It is embedded using the same embedding model
3. Top 5 most similar chunks are retrieved
4. Context block is appended to the system prompt:
   ```
   [Source Name] (relevance: 85%)
   [chunk content]
   ```
5. AI is instructed to use context when relevant, cite sources, and not invent information

## Dependencies

```bash
# Backend (already installed)
unpdf           # PDF text extraction
mammoth         # DOCX text extraction
papaparse       # CSV parsing
cheerio         # HTML parsing
@langchain/textsplitters  # Text chunking
@ai-sdk/openai  # OpenAI SDK (embedding)
```

## Database Requirements

```sql
-- PostgreSQL extension required for vector search
CREATE EXTENSION IF NOT EXISTS vector;

-- Index for faster similarity search (optional, for >10k embeddings)
CREATE INDEX IF NOT EXISTS embedding_vector_idx
ON "Embedding"
USING ivfflat ("vector" vector_cosine_ops)
WITH (lists = 100);
```

## Fallback Behavior

If Redis is unavailable, BullMQ workers are not initialized and document processing will not run. Files are uploaded and stored as `pending` but never processed.

If pgvector is not installed, embeddings are skipped and no vector search is performed. Fallback search returns recent chunks without relevance ranking.

## Known Limitations

1. **OpenAI only**: Embeddings use OpenAI exclusively. No provider abstraction yet.
2. **No OCR**: Scanned PDFs are detected and marked as `needs_ocr` but are not processed.
3. **Sequential embedding**: Each chunk is embedded in a separate API call (no batching).
4. **No caching**: Embeddings are regenerated on every query. No query cache.
5. **No document update**: Deleting and re-uploading is required to update a document.
