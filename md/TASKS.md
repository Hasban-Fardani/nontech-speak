# NonTechSpeak MVP - Development Tasks

## Phase 1: Project Setup & Configuration
- [x] Install core dependencies (Better Auth, Drizzle, Neon, etc)
- [x] Setup environment variables template
- [x] Configure Drizzle ORM with Neon PostgreSQL
- [x] Create database schema with Drizzle
- [x] Setup Better Auth server with GitHub OAuth
- [x] Configure Elysia backend structure
- [x] Setup Next.js proxy route to Elysia
- [x] Configure CORS and security headers

## Phase 2: Authentication System
- [x] Implement Better Auth with Drizzle adapter
- [x] Setup GitHub OAuth provider
- [x] Configure email verification flow
- [x] Create auth routes in Elysia
- [x] Setup Better Auth client in Next.js
- [x] Create auth UI pages (login, register, verify-email)
- [x] Implement protected route middleware
- [x] Test authentication flow end-to-end

## Phase 3: Core UI Components (Shadcn + Atomic Design)
- [x] Install and configure Shadcn UI
- [x] Setup Atomic Design folder structure
- [x] Create atom components (Button, Input, Badge, etc)
- [x] Create molecule components (FormField, Card, AudioRecorder, etc)
- [x] Create organism components (Navbar, Sidebar, TranslationForm, etc)
- [ ] Implement dark mode support
- [ ] Setup i18n structure (English first)

## Phase 4: Translation Feature (Text Only)
- [x] Setup TanStack AI with Google AI provider
- [x] Create translation service in Elysia
- [x] Implement translation endpoint with streaming
- [x] Create translation page UI
- [x] Implement audience selector
- [x] Add text input with validation
- [x] Display translation results
- [x] Save translations to database
- [x] Implement error handling and quota management
- [x] Add toast notifications for user feedback

## Phase 5: Speech-to-Text Integration
- [ ] Setup Cloudflare R2 for file storage
- [ ] Create audio file upload endpoint
- [ ] Implement file validation (size, type, magic number)
- [x] Create AudioRecorder component (UI Only)
- [x] Create AudioUploader component (UI Only)
- [x] Integrate voice input to translation flow (UI Only)
- [ ] Implement STT with Google AI/OpenRouter
- [ ] Create transcription endpoint
- [ ] Add error handling for audio processing

## Phase 6: Practice Mode
- [ ] Create practice service in Elysia
- [ ] Implement AI evaluation endpoint
- [ ] Create practice page UI
- [ ] Add challenge selection system
- [ ] Create practice page UI
- [ ] Add challenge selection system
- [ ] Implement feedback display
- [x] Create practice history view (UI Only implemented at /history)
- [ ] Add score tracking

## Phase 7: Example Library
- [ ] Create library listing endpoint
- [ ] Implement search and filter functionality
- [ ] Create library page UI
- [ ] Add upvote functionality
- [ ] Implement save/unsave examples
- [ ] Create saved examples view
- [ ] Add pagination

## Phase 8: Security & Polish
- [ ] Implement rate limiting (in-memory)
- [ ] Add input sanitization
- [ ] Configure security headers
- [ ] Setup Sentry for error tracking
- [ ] Add API documentation with Elysia plugin
- [ ] Mobile responsiveness check
- [ ] Dark mode polish

## Phase 9: Deployment
- [ ] Setup production environment variables
- [ ] Configure Vercel deployment
- [ ] Test production build
- [ ] Deploy to Vercel
- [ ] Verify all features in production
