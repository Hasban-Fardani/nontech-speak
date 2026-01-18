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
*   **Current**: Streams response but doesn't save.
*   **TODO**:
    *   Accept `isPublic` boolean in body (default false).
    *   Generate `shareId` (nanoid) immediately.
    *   **After** streaming completes (or during), save the record to `translations` table.
    *   Return the `id` and `shareId` in the final response data.

#### 2. `PATCH /api/translation/:id/visibility` (New)
*   **Auth**: Required.
*   **Body**: `{ isPublic: boolean }`.
*   **Logic**: Update `isPublic` status for specific translation.

#### 3. `GET /api/translation/history` (New)
*   **Auth**: Required.
*   **Query Params**: `page`, `limit` (pagination).
*   **Logic**: Fetch entries from `translations` where `userId` matches session. Order by `createdAt` desc.
*   **Response**: List of translation objects.

#### 3. `GET /api/translation/:id` (New)
*   **Auth**: Required.
*   **Logic**: Fetch single translation by ID. Ensure `userId` matches.
*   **Response**: Translation details.

#### 4. `DELETE /api/translation/:id` (New)
*   **Auth**: Required.
*   **Logic**: Delete translation if `userId` matches.

---

### B. Public Sharing & Feed (`server/routes/public.ts`)

#### 1. `GET /api/public/feed` (New)
*   **Auth**: Public.
*   **Query Params**: `limit` (default 10).
*   **Logic**:
    *   Fetch `translations` where `isPublic` is `true`.
    *   Order by `createdAt` desc.
    *   **Security**: Return limited fields (User name/avatar if allowed, text, tone, etc.).
*   **Response**: List of public translations.

#### 2. `GET /api/share/:shareId` (New)
*   **Auth**: **Public** (No auth required).
*   **Logic**:
    *   Find translation by `shareId`.
    *   Check if exist.
    *   (Optional) Increment `viewCount` (async, don't block response).
    *   **Security**: Return ONLY strictly necessary fields (`originalText`, `translatedText`, `audience`, `createdAt`). **DO NOT** return `userId` or internal metadata.
*   **Response**: `{ originalText, translatedText, audience, createdAt }`.

---

### C. Settings & Profile (`server/routes/user.ts`)

#### 1. `PATCH /api/user/settings` (New)
*   **Auth**: Required.
*   **Body**: `{ defaultModel, defaultAudience, defaultTone, theme, apiKeys }`.
*   **Logic**:
    *   Validate input (Zod).
    *   If `apiKeys` provided, **ENCRYPT** them before saving (using a server-side secret).
    *   Update user record.
*   **Response**: Success status.

#### 2. `POST /api/user/change-password` (New)
*   **Auth**: Required.
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

#### 1. `GET /api/practice/challenges` (New)
*   **Auth**: Required.
*   **Query Params**: `difficulty`, `status`, `tags`.
*   **Logic**: Fetch available challenges.
*   **Response**: List of challenges with status (locked/unlocked/completed).

#### 2. `POST /api/practice/submit` (New)
*   **Auth**: Required.
*   **Body**: `{ challengeId, input, audioBlob? }`.
*   **Logic**:
    *   AI Grading (Score, Feedback, Strengths, Improvements).
    *   Update User XP.
    *   Save attempt to history.
*   **Response**: Grading result.

### F. Leaderboard (`server/routes/leaderboard.ts`)

#### 1. `GET /api/leaderboard` (New)
*   **Auth**: Required.
*   **Query Params**: `period` (today, week, month, all_time).
*   **Logic**:
    *   Aggregate User XP based on period.
    *   Rank users.

### G. Examples Library (`server/routes/examples.ts`)

#### 1. `GET /api/examples` (Public/Private)
*   **Auth**: Optional (Public for `/library`, Auth for `/examples` dashboard if needed).
*   **Query Params**: `search`, `category`, `sort`.
*   **Response**: List of examples.

#### 2. `GET /api/examples/:id` (Public/Private)
*   **Auth**: Optional.
*   **Response**: Example details + Comments.

#### 3. `POST /api/examples/:id/upvote`
*   **Auth**: Required.
*   **Logic**: Increment upvote count. Prevent double voting per user (requires `upvotes` table or array tracking).

#### 4. `POST /api/examples/:id/comments`
*   **Auth**: Required.
*   **Body**: `{ content }`.
*   **Logic**: Add comment.

---

---

## 3. Files to Create/Modify

### Schema
*   [ ] `server/db/schema.ts` - Add `translations` table.

### Routes
*   [ ] `server/routes/translation.ts` - Update POST, Add GET history.
*   [ ] `server/routes/share.ts` - Create new file for public sharing.
*   [ ] `server/routes/user.ts` - Add settings updates.
*   [ ] `server/routes/audio.ts` - Create new file for STT.
*   [ ] `server/routes/practice.ts` - Create new file for Practice Mode.
*   [ ] `server/routes/leaderboard.ts` - Create new file for Leaderboard.
*   [ ] `server/routes/examples.ts` - Create new file for Examples Library.

### Config
*   [ ] `lib/encryption.ts` - Helper to encrypt/decrypt API keys.

---

## 4. Implementation Steps Order

1.  **Schema Update**: Define and push DB schema changes.
2.  **History API**: specific `GET` endpoint to populate the History page (replace dummy data).
3.  **Share API**: Backend for public share links (saving `shareId` on creation).
4.  **Settings API**: Persisting user preferences.
5.  **Audio API**: Hooking up the microphone recording to actual STT service.
