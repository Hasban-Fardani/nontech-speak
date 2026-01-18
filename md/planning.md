# NonTechSpeak - Technical Documentation

## Overview

NonTechSpeak adalah platform yang membantu developer menjelaskan konsep teknis kepada non-technical audience menggunakan AI. Platform ini mendukung input text dan voice, dengan fitur practice mode dan example library.

---

## Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Elysia.js
- **Authentication**: Better Auth
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **AI Orchestration**: TanStack AI
- **File Storage**: Cloudflare R2
- **Email Service**: Resend
- **Linter**: Biome
- **Deployment**: vercel

### Frontend
- **Framework**: Next.js 16 App Router
- **AI Client**: TanStack AI React
- **Auth Client**: Better Auth Client
- **Styling**: Tailwind CSS
- **Component Architecture**: Atomic Design
- **Audio Capture**: MediaRecorder API
- **State Management**: Zustand (conditional)
- **Form Validation**: Zod
- **Form State Management**: React Hook Form
- **UI Library**: Shadcn UI

### Communication Pattern
- Next.js proxy route: `app/api/[[...slugs]]/route.ts`
- Pure forwarding to Elysia backend
- No business logic in Next.js

---

## Architecture Principles

### Separation of Concerns
- **Next.js**: Frontend UI + API proxy only
- **Elysia**: Complete backend (auth, business logic, database, AI, file handling)

### Request Flow
```
Browser → Next.js UI → app/api/[[...slugs]]/route.ts → Elysia Backend → PostgreSQL/AI/Storage
```

### Authentication Flow
- Better Auth Client di frontend untuk auth state
- Better Auth Server di Elysia untuk auth logic
- Session-based authentication dengan secure cookies
- Email verification required

---

## Project Structure

### Monorepo Root
```
nontechspeak/
├── apps/
│   ├── web/              # Next.js 16 Frontend
│   └── api/              # Elysia Backend
├── packages/
│   ├── ui/               # Atomic Design Components
│   ├── types/            # Shared TypeScript Types
│   └── config/           # Shared Configuration
├── bun.lock
├── turbo.json
├── package.json
└── README.md
```

---

## Next.js Structure (apps/web/)
```
apps/web/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── about/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── verify-email/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── translate/
│   │   │   └── page.tsx
│   │   ├── practice/
│   │   │   └── page.tsx
│   │   ├── library/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── profile/
│   │       ├── page.tsx
│   │       └── settings/
│   │           └── page.tsx
│   │
│   ├── api/
│   │   └── [[...slugs]]/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── CTA.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   └── RecentActivity.tsx
│   └── profile/
│       └── ProfileForm.tsx
│
├── lib/
│   ├── auth-client.ts        # Better Auth Client setup
│   ├── api-client.ts         # Fetch wrapper
│   ├── utils.ts
│   └── constants.ts
│
├── hooks/
│   ├── useTranslation.ts
│   ├── usePractice.ts
│   ├── useLibrary.ts
│   └── useToast.ts
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Elysia Backend Structure (apps/api/)
```
apps/api/
├── src/
│   ├── index.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   ├── cors.ts
│   │   └── security.ts
│   │
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── translation.ts
│   │   ├── practice.ts
│   │   ├── speech.ts
│   │   ├── library.ts
│   │   └── user.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── translation.service.ts
│   │   ├── practice.service.ts
│   │   ├── speech.service.ts
│   │   ├── ai.service.ts
│   │   ├── email.service.ts
│   │   └── storage.service.ts
│   │
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── migrations/
│   │
│   ├── lib/
│   │   ├── auth.ts              # Better Auth Server setup
│   │   ├── ai.ts                # TanStack AI setup
│   │   ├── email.ts
│   │   └── validation.ts        # Zod schemas
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── translation.types.ts
│   │   ├── practice.types.ts
│   │   └── index.ts
│   │
│   └── utils/
│       ├── error.ts
│       ├── response.ts
│       ├── file-validation.ts
│       └── sanitization.ts
│
├── drizzle.config.ts
├── tsconfig.json
└── package.json
```

---

## Packages Structure

### packages/ui/
```
packages/ui/
├── src/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Textarea/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Icon/
│   │   ├── Label/
│   │   ├── Select/
│   │   ├── Spinner/
│   │   ├── Alert/
│   │   └── index.ts
│   │
│   ├── molecules/
│   │   ├── FormField/
│   │   ├── Card/
│   │   ├── Dropdown/
│   │   ├── AudioRecorder/
│   │   ├── ScoreCard/
│   │   ├── TranscriptBox/
│   │   ├── AudienceSelector/
│   │   ├── Feedback/
│   │   └── index.ts
│   │
│   ├── organisms/
│   │   ├── TranslationForm/
│   │   ├── VoiceInputCard/
│   │   ├── PracticeCard/
│   │   ├── ExampleGrid/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   └── index.ts
│   │
│   ├── templates/
│   │   ├── DashboardLayout/
│   │   ├── AuthLayout/
│   │   ├── LandingLayout/
│   │   └── index.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── index.ts
│
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### packages/types/
```
packages/types/
├── src/
│   ├── api/
│   │   ├── request.types.ts
│   │   ├── response.types.ts
│   │   └── index.ts
│   │
│   ├── models/
│   │   ├── user.types.ts
│   │   ├── translation.types.ts
│   │   ├── practice.types.ts
│   │   ├── audio.types.ts
│   │   └── index.ts
│   │
│   ├── enums/
│   │   ├── audience.enum.ts
│   │   ├── input-method.enum.ts
│   │   ├── status.enum.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── tsconfig.json
└── package.json
```

### packages/config/
packages/config/
├── eslint/
│   └── base.js
├── tailwind/
│   └── base.config.ts
├── typescript/
│   ├── base.json
│   ├── nextjs.json
│   └── node.json
└── package.json

---

## Database Schema

### users
- id (primary key)
- email (unique, indexed)
- password_hash
- name
- email_verified (boolean, default false)
- verification_token (nullable, indexed)
- verification_token_expiry (nullable)
- password_reset_token (nullable, indexed)
- password_reset_token_expiry (nullable)
- profile_image_url (nullable)
- created_at
- updated_at

### sessions
- id (primary key)
- user_id (foreign key → users.id, cascade delete)
- token (unique, indexed)
- expires_at (indexed)
- ip_address
- user_agent
- created_at

### translations
- id (primary key)
- user_id (foreign key → users.id, cascade delete, indexed)
- technical_text (text)
- simplified_text (text)
- audience_type (enum: parent, partner, friend, child)
- input_method (enum: text, voice)
- audio_file_id (foreign key → audio_files.id, nullable, set null on delete)
- is_public (boolean, default false, indexed)
- upvotes_count (integer, default 0, indexed)
- view_count (integer, default 0)
- ai_model (nullable)
- tokens_used (integer, nullable)
- created_at (indexed)
- updated_at

### practices
- id (primary key)
- user_id (foreign key → users.id, cascade delete, indexed)
- user_input (text)
- input_method (enum: text, voice)
- audio_file_id (foreign key → audio_files.id, nullable, set null on delete)
- feedback_text (text)
- score (integer 0-100)
- suggestions (json)
- challenge_prompt (nullable)
- created_at (indexed)

### saved_examples
- id (primary key)
- user_id (foreign key → users.id, cascade delete)
- translation_id (foreign key → translations.id, cascade delete)
- created_at
- unique constraint on (user_id, translation_id)

### audio_files
- id (primary key)
- user_id (foreign key → users.id, cascade delete, indexed)
- file_url
- file_size (integer, bytes)
- duration (integer, seconds, nullable)
- mime_type
- original_filename
- transcription_text (nullable)
- transcription_status (enum: pending, processing, completed, failed, default pending, indexed)
- created_at (indexed)

### Database Indexes
- users: email, verification_token, password_reset_token
- sessions: token, expires_at, user_id
- translations: user_id, is_public, created_at, upvotes_count
- practices: user_id, created_at
- audio_files: user_id, transcription_status, created_at

---

## Security Implementation

### Authentication Security

#### Password Security
- Minimum password length: 8 characters
- Password hashing with bcrypt (cost factor 12)
- Password strength validation (uppercase, lowercase, number, special char)
- Rate limiting on login attempts (5 attempts per 15 minutes per IP)
- Account lockout after failed attempts (30 minutes)

#### Session Security
- Secure HTTP-only cookies
- SameSite cookie attribute (Strict)
- Session expiration (7 days)
- Session rotation on privilege escalation
- CSRF token validation
- IP address binding (optional)
- User agent validation

#### Email Verification
- Required before accessing protected features
- Verification token: cryptographically random (32 bytes)
- Token expiration: 24 hours
- Single-use tokens (invalidated after use)
- Rate limiting on resend (1 request per 5 minutes)

#### Password Reset
- Reset token: cryptographically random (32 bytes)
- Token expiration: 1 hour
- Single-use tokens
- Rate limiting (3 requests per hour per email)
- Email notification on password change

### Authorization

#### Role-Based Access Control
- User can only access their own resources
- User can view public translations
- User can only modify/delete their own content
- Admin role for future moderation features

#### Resource Authorization Checks
- Verify user ownership before update/delete operations
- Validate user session on every protected endpoint
- Check email verification status
- Implement field-level permissions

### Input Validation

#### Request Validation
- Zod schemas for all endpoint inputs
- Type checking at runtime
- Length limits on all text fields
- Email format validation
- URL validation for file URLs
- Enum validation for categorical fields

#### Sanitization
- HTML sanitization for user inputs
- XSS prevention on all text outputs
- SQL injection prevention via ORM
- NoSQL injection prevention

#### Rate Limiting
- Global rate limit: 100 requests per minute per IP
- Auth endpoints: 5 requests per 15 minutes per IP
- Translation creation: 10 requests per minute per user
- Practice creation: 10 requests per minute per user
- File upload: 5 requests per minute per user
- Public library: 30 requests per minute per IP

### File Security

#### File Upload Validation
- Allowed MIME types: audio/webm, audio/wav, audio/mp3, audio/ogg
- Maximum file size: 10MB
- File extension validation
- Magic number (file signature) verification
- Virus scanning (optional, via third-party service)

#### File Storage Security
- Unique random filenames (UUID-based)
- Separate storage bucket per user (optional)
- Signed URLs with expiration
- Access control lists (ACL)
- No direct file system access
- Content-Type header enforcement

#### File Processing
- Timeout limits on transcription
- Resource limits (memory, CPU)
- Sandboxed processing environment
- Error handling for corrupted files

### API Security

#### CORS Configuration
- Whitelist allowed origins
- Credentials support enabled
- Preflight caching
- Allowed methods: GET, POST, PUT, DELETE, PATCH
- Allowed headers specification

#### Headers Security
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)

#### Request Security
- Request size limits (10MB)
- Request timeout (30 seconds)
- JSON depth limits
- Query parameter limits

### Error Handling

#### Error Response Strategy
- Never expose stack traces in production
- Generic error messages for authentication failures
- Detailed error codes for debugging (internal only)
- Logging all security-related errors
- Alert on suspicious activities

#### Error Types
- Validation errors: 400 with field details
- Authentication errors: 401 with generic message
- Authorization errors: 403 with generic message
- Not found errors: 404
- Rate limit errors: 429 with retry-after
- Server errors: 500 with generic message

---

## Feedback System

### UI Feedback Components

#### Success Feedback
- Toast notification (green, auto-dismiss 3s)
- Success icon
- Clear success message
- Optional action button

#### Error Feedback
- Toast notification (red, auto-dismiss 5s or manual dismiss)
- Error icon
- Clear error message
- Retry action (if applicable)
- Support contact info (for critical errors)

#### Warning Feedback
- Toast notification (yellow, auto-dismiss 4s)
- Warning icon
- Warning message
- Optional action

#### Info Feedback
- Toast notification (blue, auto-dismiss 3s)
- Info icon
- Informational message

#### Loading States
- Spinner for async operations
- Progress bar for file uploads
- Skeleton screens for page loads
- Disable form during submission

### Feedback Scenarios

#### Authentication
- Success: "Login successful! Redirecting..."
- Error: "Invalid email or password"
- Warning: "Please verify your email before continuing"
- Info: "Verification email sent to your inbox"

#### Translation
- Success: "Translation created successfully!"
- Error: "Failed to process translation. Please try again."
- Warning: "Translation may take a few seconds for complex text"
- Loading: "Translating..." with streaming indicator

#### Speech-to-Text
- Success: "Audio transcribed successfully!"
- Error: "Failed to transcribe audio. Please check file format."
- Warning: "Audio quality is low, transcription may be inaccurate"
- Loading: "Transcribing audio..." with progress percentage

#### File Upload
- Success: "File uploaded successfully!"
- Error: "File upload failed. Maximum size is 10MB."
- Warning: "File size is large, upload may take a while"
- Loading: Progress bar showing upload percentage

#### Practice
- Success: "Practice session saved!"
- Error: "Failed to evaluate practice. Please try again."
- Info: "Your score improved by 15 points!"

#### Library
- Success: "Example saved to your collection!"
- Error: "Failed to save example"
- Info: "Example removed from your collection"

---

## Better Auth Integration

### Frontend Setup (Next.js)

#### Better Auth Client Configuration
- Initialize Better Auth Client with Elysia backend URL
- Configure auth endpoints
- Session management
- Auto token refresh
- Interceptor for expired sessions

#### Auth Hooks
- `useSession()`: Get current session state
- `useUser()`: Get current user data
- `useAuth()`: Auth methods (login, logout, register)
- `useEmailVerification()`: Verification methods

#### Protected Routes Pattern
- Check session in layout components
- Redirect to login if not authenticated
- Redirect to verify-email if not verified
- Show loading state during auth check

### Backend Setup (Elysia)

#### Better Auth Server Configuration
- Initialize Better Auth with Drizzle adapter
- Configure session strategy
- Configure email provider
- Configure password validation
- Configure CORS for auth endpoints

#### Auth Endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/verify-email
- POST /auth/resend-verification
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /auth/session
- GET /auth/me

#### Auth Middleware
- Session validation
- Email verification check
- Role authorization
- Rate limiting per endpoint

---

## Email Verification Flow

### Registration Flow
1. User submits registration form
2. Frontend validates input
3. POST to Elysia /auth/register
4. Elysia validates data (Zod schema)
5. Elysia checks email uniqueness
6. Elysia hashes password (bcrypt)
7. Elysia creates user record (email_verified = false)
8. Elysia generates verification token (crypto.randomBytes)
9. Elysia stores token with 24h expiry
10. Elysia sends verification email
11. Elysia returns success feedback
12. Frontend shows "Check your email" message
13. Frontend redirects to login

### Verification Flow
1. User clicks verification link from email
2. Link opens Next.js /verify-email?token=xxx
3. Page extracts token from URL query
4. POST to Elysia /auth/verify-email with token
5. Elysia validates token exists
6. Elysia checks token not expired
7. Elysia updates user.email_verified = true
8. Elysia deletes verification token
9. Elysia creates session
10. Elysia returns success feedback
11. Frontend shows success message
12. Frontend redirects to dashboard

### Resend Verification Flow
1. User clicks "Resend verification email"
2. POST to Elysia /auth/resend-verification
3. Elysia checks rate limit
4. Elysia generates new token
5. Elysia updates token in database
6. Elysia sends new verification email
7. Elysia returns success feedback
8. Frontend shows "Email sent" message

### Access Control for Unverified Users
- Allow access to public pages
- Allow access to auth pages
- Block access to dashboard
- Block access to translation features
- Block access to practice features
- Show verification reminder banner

---

## Speech-to-Text Flow

### Recording Phase (Frontend)
1. User navigates to translation or practice page
2. User selects "Voice" input method
3. AudioRecorder component renders
4. User clicks "Record" button
5. Request microphone permission
6. Show permission feedback
7. MediaRecorder starts capturing
8. Display recording indicator (red dot)
9. Display real-time duration counter
10. Display waveform visualization
11. User clicks "Stop" button
12. MediaRecorder stops
13. Audio blob created
14. Display preview controls (play, re-record)

### Upload Phase
1. User confirms audio
2. Create FormData with audio blob
3. Show upload progress feedback
4. POST to Elysia /speech/upload via proxy
5. Elysia receives multipart/form-data
6. Elysia validates file type
7. Elysia validates file size
8. Elysia validates MIME type
9. Elysia validates magic number
10. Elysia generates unique filename
11. Elysia uploads to file storage
12. Elysia creates audio_files record (status: pending)
13. Elysia returns audio file ID and URL
14. Frontend shows upload success feedback

### Transcription Phase
1. Frontend POSTs to Elysia /speech/transcribe with audio ID
2. Elysia retrieves audio file record
3. Elysia validates file exists
4. Elysia updates status to "processing"
5. Elysia calls TanStack AI with audio URL
6. TanStack AI processes via STT provider
7. Show processing feedback (estimated time)
8. TanStack AI returns transcription text
9. Elysia validates transcription result
10. Elysia sanitizes transcription text
11. Elysia updates audio_files record
12. Elysia updates status to "completed"
13. Elysia returns transcription text
14. Frontend shows success feedback
15. Frontend displays transcription in textarea
16. User can edit transcription if needed

### Error Handling
- File too large: Show error feedback with size limit
- Invalid format: Show error feedback with allowed formats
- Upload failed: Show retry option
- Transcription failed: Show retry option with original audio preserved
- Timeout: Show timeout error with retry option
- Network error: Show offline feedback

### Status Polling (Optional)
1. Frontend polls GET /speech/status/:id every 2 seconds
2. Elysia returns current status and progress
3. Frontend updates progress bar
4. Stop polling when status = "completed" or "failed"
5. Show appropriate feedback based on final status

---

## AI Integration with TanStack AI

### TanStack AI Setup

#### Provider Configuration
- Configure AI provider adapter
- Set API keys in environment variables
- Configure rate limits
- Configure timeout settings
- Configure retry strategy

#### Translation Tool
- Define input schema (technical text, audience type)
- Define output schema (simplified text, metadata)
- Define system prompts per audience type
- Configure temperature and max tokens
- Configure streaming options

#### Practice Evaluation Tool
- Define input schema (user explanation, challenge)
- Define output schema (score, feedback, suggestions)
- Define evaluation criteria
- Configure scoring algorithm
- Configure feedback generation

#### Speech-to-Text Tool
- Define audio input handling
- Configure transcription model
- Configure language detection
- Configure punctuation restoration
- Configure speaker diarization (optional)

### AI Processing Flow

#### Translation Request
1. Receive translation request
2. Validate input with Zod
3. Sanitize technical text
4. Select appropriate system prompt based on audience
5. Call TanStack AI with streaming enabled
6. Stream response chunks to frontend
7. Aggregate complete response
8. Sanitize output
9. Save to database with AI metadata
10. Return final result

#### Practice Evaluation Request
1. Receive practice request
2. Validate input
3. Retrieve challenge context
4. Build evaluation prompt
5. Call TanStack AI
6. Parse structured feedback
7. Calculate score
8. Generate suggestions array
9. Save to database
10. Return feedback object

#### Error Handling
- AI provider timeout: Retry with exponential backoff
- Rate limit exceeded: Queue request or return error
- Invalid response: Parse error and retry
- Token limit exceeded: Truncate input and warn user
- Provider unavailable: Fallback to alternative or error feedback

---

## API Endpoints Specification

### Authentication Endpoints

#### POST /auth/register
- Input: email, password, name
- Validation: Email format, password strength, name length
- Rate limit: 5 per 15 minutes per IP
- Response: Success feedback or validation errors

#### POST /auth/login
- Input: email, password
- Validation: Email format, credentials
- Rate limit: 5 per 15 minutes per IP
- Response: Session token, user data, or error

#### POST /auth/logout
- Input: Session token (cookie)
- Authentication: Required
- Response: Success feedback

#### POST /auth/verify-email
- Input: Verification token
- Validation: Token format, expiry
- Rate limit: 10 per hour per IP
- Response: Success feedback or error

#### POST /auth/resend-verification
- Input: Email
- Rate limit: 1 per 5 minutes per email
- Response: Success feedback

#### POST /auth/forgot-password
- Input: Email
- Rate limit: 3 per hour per email
- Response: Success feedback (always, to prevent enumeration)

#### POST /auth/reset-password
- Input: Reset token, new password
- Validation: Token, password strength
- Rate limit: 5 per hour per IP
- Response: Success feedback or error

#### GET /auth/session
- Authentication: Required
- Response: Current session data

#### GET /auth/me
- Authentication: Required
- Authorization: Email verified
- Response: Current user profile

### Translation Endpoints

#### POST /translation/create
- Input: technical_text, audience_type, input_method, audio_file_id (optional)
- Authentication: Required
- Authorization: Email verified
- Validation: Text length (max 5000 chars), audience type enum
- Rate limit: 10 per minute per user
- Response: Translation object with streaming support

#### GET /translation/list
- Authentication: Required
- Authorization: Email verified
- Query params: page, limit, filter (own/public)
- Response: Paginated translation list

#### GET /translation/:id
- Authentication: Required
- Authorization: Owner or public translation
- Response: Translation object

#### PUT /translation/:id
- Input: is_public (toggle visibility)
- Authentication: Required
- Authorization: Owner only
- Response: Updated translation object

#### DELETE /translation/:id
- Authentication: Required
- Authorization: Owner only
- Response: Success feedback

#### POST /translation/:id/upvote
- Authentication: Required
- Authorization: Email verified
- Rate limit: 1 per translation per user
- Response: Updated upvote count

### Practice Endpoints

#### POST /practice/create
- Input: user_input, input_method, audio_file_id (optional), challenge_prompt (optional)
- Authentication: Required
- Authorization: Email verified
- Validation: Input length (max 2000 chars)
- Rate limit: 10 per minute per user
- Response: Practice object with feedback

#### GET /practice/list
- Authentication: Required
- Authorization: Email verified
- Query params: page, limit
- Response: Paginated practice list

#### GET /practice/:id
- Authentication: Required
- Authorization: Owner only
- Response: Practice object

#### GET /practice/challenges
- Authentication: Required
- Response: List of practice challenges

### Speech Endpoints

#### POST /speech/upload
- Input: Audio file (multipart/form-data)
- Authentication: Required
- Authorization: Email verified
- Validation: File size (max 10MB), MIME type, magic number
- Rate limit: 5 per minute per user
- Response: Audio file object with ID

#### POST /speech/transcribe
- Input: audio_file_id
- Authentication: Required
- Authorization: Owner of audio file
- Rate limit: 5 per minute per user
- Response: Transcription text

#### GET /speech/status/:id
- Authentication: Required
- Authorization: Owner of audio file
- Response: Transcription status and progress

### Library Endpoints

#### GET /library/examples
- Authentication: Optional (public endpoint with lower rate limit)
- Query params: page, limit, audience_type, search, sort (recent/popular)
- Rate limit: 30 per minute per IP
- Response: Paginated public translations

#### GET /library/examples/:id
- Authentication: Optional
- Response: Public translation details

#### POST /library/save/:id
- Authentication: Required
- Authorization: Email verified
- Response: Success feedback

#### DELETE /library/save/:id
- Authentication: Required
- Authorization: Email verified
- Response: Success feedback

#### GET /library/saved
- Authentication: Required
- Authorization: Email verified
- Query params: page, limit
- Response: Paginated saved examples

### User Endpoints

#### GET /user/me
- Authentication: Required
- Response: User profile

#### PUT /user/profile
- Input: name, profile_image_url
- Authentication: Required
- Validation: Name length, URL format
- Response: Updated user profile

#### GET /user/stats
- Authentication: Required
- Response: User statistics (total translations, practices, average score)

#### GET /user/history
- Authentication: Required
- Query params: type (translation/practice), page, limit
- Response: Combined activity history

---

## Development Timeline

### Phase 1: Setup & Foundation (7 hours)
- Monorepo initialization (Turborepo + pnpm)
- Elysia backend initialization
- Next.js 16 frontend initialization
- Database connection setup
- Drizzle ORM configuration
- Better Auth server setup
- Better Auth client setup
- Email service integration
- Proxy route implementation
- Environment variables setup
- Security headers configuration

### Phase 2: Authentication System (5 hours)
- User registration endpoint with validation
- Login endpoint with session creation
- Logout endpoint
- Email verification endpoint
- Resend verification endpoint
- Password reset endpoints
- Auth middleware implementation
- Rate limiting on auth endpoints
- Auth UI components (login, register, verify pages)
- Better Auth Client integration in frontend
- Protected route guards

### Phase 3: Core Translation Feature - Text Only (6 hours)
- Translation page UI
- Text input component with validation
- Audience selector component
- TanStack AI integration in backend
- Translation service implementation
- Translation creation endpoint
- Streaming response handling
- Result display component
- Save translation to database
- Input validation and sanitization
- Error handling

### Phase 4: Speech-to-Text Integration (7 hours)
- AudioRecorder component development
- File upload UI with progress
- File validation (size, type, magic number)
- File upload endpoint
- File storage integration
- Audio file record creation
- Transcription endpoint

TanStack AI STT integration
Transcription status polling
Voice input UI integration
Input method toggle
Error handling for audio processing

Phase 5: Practice Mode (6 hours)

Practice page UI
Challenge selection system
Practice input component (text/voice support)
Practice evaluation service
Practice creation endpoint
AI feedback generation
Score calculation logic
Feedback display component
Practice history view
Progress tracking

Phase 6: Example Library (5 hours)

Library page UI
Public translations listing endpoint
Search functionality implementation
Filter by audience type
Sort by recent/popular
Pagination implementation
Upvote endpoint
Save/unsave endpoints
Saved examples view
Example detail page

Phase 7: Atomic Design Components (4 hours)

Complete all atom components
Complete all molecule components
Complete all organism components
Complete all template components
Ensure component reusability
Implement consistent styling
Add loading states
Add error states
Add success feedback components

Phase 8: Security Hardening (3 hours)

Implement all rate limiting
Add CSRF protection
Configure security headers
Add input sanitization
Add file validation layers
Test authorization rules
Audit authentication flow
Review session management

Phase 9: Testing & Bug Fixes (4 hours)

Test authentication flow end-to-end
Test translation feature (text and voice)
Test practice feature
Test library feature
Test error scenarios
Fix identified bugs
Performance optimization
Edge case handling

Phase 10: Deployment & Final Polish (1 hour)

Deploy Elysia backend
Deploy Next.js frontend
Configure production environment variables
SSL certificate setup
Database migration execution
Final UI polish

Environment Variables
Backend (Elysia)
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
EMAIL_PROVIDER
EMAIL_API_KEY
EMAIL_FROM
AI_PROVIDER_API_KEY
FILE_STORAGE_URL
FILE_STORAGE_API_KEY
CORS_ALLOWED_ORIGINS
NODE_ENV
RATE_LIMIT_ENABLED
Frontend (Next.js)
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_BETTER_AUTH_URL
NEXT_PUBLIC_APP_URL