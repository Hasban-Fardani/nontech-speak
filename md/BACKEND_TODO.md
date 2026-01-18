# Backend Implementation Todo List

This document outlines the backend requirements to support the new UI features (Share, History, Settings, Audio).
> **NOTE**: All backend implementation is currently deferred. Focus is restricted to UI only.

## 0. Immediate Backlog (Rolled Back Changes)
The following items were attempted but rolled back to strictly separate UI from Backend work:
*   [ ] **Schema Update**: Add `translations` table and `user_settings` table (or columns) to `server/db/schema.ts`.
*   [ ] **Migration**: Run `bun db:push` to apply changes.
*   [ ] **API**: Implement endpoints below.

## 1. Database Schema (Drizzle ORM)

We need to update `server/db/schema.ts` to include the following tables/columns.

### Tables

#### `translations`
Stores the history of translations for users.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `text` (primary key) | Cuid2 or UUID. |
| `userId` | `text` (foreign key) | JSON reference to `user.id`. Nullable if we allow anonymous usage later (though currently auth required). |
| `originalText` | `text` | The input technical text. |
| `translatedText` | `text` | The output simplified text. |
| `audience` | `varchar` | Enum: 'child', 'teenager', 'adult', 'expert', 'parent', 'partner', 'friend'. |
| `tone` | `varchar` | Enum: 'professional', 'casual', 'funny'. |
| `model` | `varchar` | Model used (e.g., 'gemini-1.5-pro'). |
| `duration` | `integer` | Time taken to generate in ms (optional stats). |
| `shareId` | `text` (unique) | Short UID for public sharing (e.g., nano-id). Indexed. |
| `isPublic` | `boolean` | Toggle for public visibility. Default `false`. If true, appears on landing page. |
| `viewCount` | `integer` | Track views on shared link. Default 0. |
| `createdAt` | `timestamp` | Creation time. |
| `updatedAt` | `timestamp` | Last update. |

#### `examples` (New)
Stores the community examples/analogies.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `text` (PK) | Cuid2. |
| `title` | `text` | Title of the analogy. |
| `description` | `text` | Short description. |
| `content` | `text` | Full markdown content. |
| `tags` | `json` | Array of strings (e.g. ['DevOps', 'AI']). |
| `category` | `varchar` | Main category. |
| `upvotes` | `integer` | Count of upvotes. |
| `authorId` | `text` (FK) | User who created it. |
| `createdAt` | `timestamp` | Creation time. |

#### `comments` (New)
Comments on examples.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `text` (PK) | Cuid2. |
| `exampleId` | `text` (FK) | Reference to `examples.id`. |
| `userId` | `text` (FK) | Author of comment. |
| `content` | `text` | Comment text. |
| `createdAt` | `timestamp` | Creation time. |

#### `user_settings` (or add columns to `user` table)
It might be cleaner to keep `user` table simple and have a separate settings table, or just add a JSON column `preferences` to the `user` table if the schema allows. Let's assume a separate logical grouping or columns.

*Suggested Approach: Add columns to `user` table for simplicity if valid, or a 1:1 `user_preference` table.*

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `defaultModel` | `varchar` | 'gemini-1.5-pro' | User's preferred model. |
| `defaultAudience` | `varchar` | 'adult' | User's preferred audience. |
| `defaultTone` | `varchar` | 'casual' | User's preferred tone. |
| `theme` | `varchar` | 'system' | UI Theme preference (synced). |
| `apiKeys` | `json` | `{}` | **Encrypted** storage for user's own API keys (Google, OpenAI, Anthropic). |

---

## 2. API Endpoints

Implement these routes in `server/routes/` or standard Next.js API routes if moving away from Elysia (Use the existing pattern). Assuming Elysia/Hono pattern in `server/`.

### A. Translation & History (`server/routes/translation.ts`)

#### 1. `POST /api/translation` (Update existing)
*   [x] **Current**: Streams response but doesn't save.
*   [x] **TODO**:
    *   Accept `isPublic` boolean in body (default false).
    *   Generate `shareId` (nanoid) immediately.
    *   **After** streaming completes (or during), save the record to `translations` table.
    *   Return the `id` and `shareId` in the final response data.

#### 2. `PATCH /api/translation/:id/visibility` (New)
*   [x] **Auth**: Required.
*   [x] **Body**: `{ isPublic: boolean }`.
*   [x] **Logic**: Update `isPublic` status for specific translation.

#### 3. `GET /api/translation/history` (New)
*   [x] **Auth**: Required.
*   [x] **Query Params**: `page`, `limit` (pagination).
*   [x] **Logic**: Fetch entries from `translations` where `userId` matches session. Order by `createdAt` desc.
*   [x] **Response**: List of translation objects.

#### 3. `GET /api/translation/:id` (New)
*   [x] **Auth**: Required.
*   [x] **Logic**: Fetch single translation by ID. Ensure `userId` matches.
*   [x] **Response**: Translation details.

#### 4. `DELETE /api/translation/:id` (New)
*   [x] **Auth**: Required.
*   [x] **Logic**: Delete translation if `userId` matches.

---

### B. Public Sharing & Feed (`server/routes/public.ts`)

#### 1. `GET /api/public/feed` (New)
*   [x] **Auth**: Public.
*   [x] **Query Params**: `limit` (default 10).
*   [x] **Logic**:
    *   Fetch `translations` where `isPublic` is `true`.
    *   Order by `createdAt` desc.
    *   **Security**: Return limited fields (User name/avatar if allowed, text, tone, etc.).
*   [x] **Response**: List of public translations.

#### 2. `GET /api/share/:shareId` (New)
*   [x] **Auth**: **Public** (No auth required).
*   [x] **Logic**:
    *   Find translation by `shareId`.
    *   Check if exist.
    *   (Optional) Increment `viewCount` (async, don't block response).
    *   **Security**: Return ONLY strictly necessary fields (`originalText`, `translatedText`, `audience`, `createdAt`). **DO NOT** return `userId` or internal metadata.
*   [x] **Response**: `{ originalText, translatedText, audience, createdAt }`.

---

### C. Settings & Profile (`server/routes/user.ts`)

#### 1. `PATCH /api/user/settings` (New)
*   [x] **Auth**: Required.
*   [x] **Body**: `{ defaultModel, defaultAudience, defaultTone, theme, apiKeys }`.
*   [x] **Logic**:
    *   Validate input (Zod).
    *   If `apiKeys` provided, **ENCRYPT** them before saving (using a server-side secret).
    *   Update user record.
*   [x] **Response**: Success status.

#### 2. `POST /api/user/change-password` (New)
*   [x] **Auth**: Required.
*   **Body**: `{ currentPassword, newPassword }`.
*   **Logic**:
    *   Verify `currentPassword` matches hash.
    *   Hash `newPassword`.
    *   Update password field.
    *   (Better Auth might handle this, check docs. If so, use Better Auth client on frontend).

---

### D. Audio Services (`server/routes/audio.ts`)

#### 1. `POST /api/audio/transcribe` (New)
*   **Auth**: Required.
*   **Body**: `FormData` with `file` (audio blob).
*   **Logic**:
    *   Accept audio file (mp3, wav, webm).
    *   (Option A) Use OpenAI Whisper API (if key available).
    *   (Option B) Use Gemini Flash thinking audio capabilities.
    *   Convert audio to text.
*   **Response**: `{ text: "Transcribed text..." }`.

---

### E. Practice Mode (`server/routes/practice.ts`)

#### 1. `GET /api/practice/challenges` ✅ COMPLETED
*   **Auth**: Required.
*   **Query Params**: `difficulty`, `status`, `tags`.
*   **Logic**: Fetch available challenges from database.
*   **Response**: List of challenges with metadata.

#### 2. `POST /api/practice/submit` ✅ COMPLETED
*   **Auth**: Required.
*   **Body**: `{ challengeId, userExplanation }`.
*   **Logic**:
    *   AI Grading using Gemini (Score, Feedback, Strengths, Improvements).
    *   Update User XP in database.
    *   Save attempt to `practices` table.
*   **Response**: Grading result with XP earned.

#### 3. `GET /api/practice/history` ✅ COMPLETED
*   **Auth**: Required.
*   **Logic**: Fetch user's practice attempts.
*   **Response**: List of practice history.

#### 4. `GET /api/practice/:id` ✅ COMPLETED
*   **Auth**: Required.
*   **Logic**: Fetch specific practice attempt details.
*   **Response**: Practice details with feedback.

### F. Leaderboard (`server/routes/leaderboard.ts`)

#### 1. `GET /api/leaderboard` ✅ COMPLETED
*   **Auth**: Optional (Public access supported).
*   **Query Params**: `period` (today, week, month, all_time).
*   **Logic**:
    *   Aggregate User XP based on period.
    *   Rank users by totalXp.
    *   Support public viewing without authentication.
*   **Response**: Ranked list of users with XP.

### G. Examples Library (`server/routes/examples.ts`)

#### 1. `GET /api/public/feed` ✅ COMPLETED (via share.ts)
*   **Auth**: Public.
*   **Query Params**: `limit`.
*   **Logic**: Fetch public translations ordered by creation date.
*   **Response**: List of public examples with user info.

#### 2. `GET /api/examples/:id` ✅ COMPLETED (via examples/[id])
*   **Auth**: Required (Dashboard).
*   **Response**: Example details.

#### 3. `POST /api/vote/:translationId` ✅ COMPLETED
*   **Auth**: Required.
*   **Body**: `{ voteType: 'upvote' | 'downvote' }`.
*   **Logic**: Toggle vote on translation/example.

---

---

## 3. Files to Create/Modify

### Schema
*   [x] `server/db/schema.ts` - Add `translations`, `practices`, `challenges`, `votes` tables.
*   [x] Add `totalXp` column to `users` table.

### Routes
*   [x] `server/routes/translation.ts` - Update POST, Add GET history, visibility toggle, delete.
*   [x] `server/routes/share.ts` - Public sharing and feed endpoints.
*   [x] `server/routes/user.ts` - Settings updates with API key encryption.
*   [ ] `server/routes/audio.ts` - STT implementation (Deferred).
*   [x] `server/routes/practice.ts` - Practice Mode endpoints.
*   [x] `server/routes/leaderboard.ts` - Leaderboard endpoint.
*   [x] `server/routes/vote.ts` - Voting system for examples.

### Config
*   [x] `lib/encryption.ts` - Helper to encrypt/decrypt API keys.

---

## 4. Implementation Status

### ✅ Completed
1.  **Schema Update**: All tables created and migrated.
2.  **Translation API**: Full CRUD with public sharing.
3.  **Practice API**: Challenges, submission, AI grading, history.
4.  **Leaderboard API**: Public rankings with period filtering.
5.  **Examples/Feed API**: Public feed for landing page.
6.  **Vote API**: Upvote/downvote system.
7.  **Settings API**: User preferences with encrypted API keys.

### ⏳ Pending
1.  **Audio API**: STT implementation (requires Cloudflare R2 setup).
2.  **Rate Limiting**: In-memory rate limiting for API endpoints.
3.  **Comments System**: Comments on examples (if needed).

