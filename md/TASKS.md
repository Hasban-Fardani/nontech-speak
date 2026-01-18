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
- [x] Create Settings page UI
- [x] Implement dark mode support
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
- [x] Add Model Selector to Translation UI
- [x] Standardize Dashboard Layout & Spacing (UI Polish)
- [x] Enhance Sidebar & Navbar (Branding & User Account)
- [x] Create Account Page with Password & Linked Accounts UI
- [x] Implement Share functionality with Public Page & TTS
 
## Phase 5: Speech-to-Text Integration
- [x] Setup Cloudflare R2 for file storage
- [x] Create audio file upload endpoint
- [x] Implement file validation (size, type, magic number)
- [x] Create AudioRecorder component (UI Only)
- [x] Create AudioUploader component (UI Only)
- [x] Integrate voice input to translation flow (UI Only)
- [ ] Implement STT with Google AI/OpenRouter
- [ ] Create transcription endpoint
- [ ] Add error handling for audio processing

## Phase 6: Practice Mode
- [x] Create practice service in Elysia
- [x] Implement AI evaluation endpoint
- [x] Create Practice List UI (Status Filter, Tags, Search)
- [x] Create Practice Detail UI (Goals, Hints, Input)
- [x] Implement Real Scoring & Feedback with AI
- [x] Create Practice History integration
- [x] Add "Practice" to Sidebar
- [x] Connect Practice pages to backend API

## Phase 7: Gamification
- [x] Create Leaderboard Page UI
- [x] Implement Time Filters (Today, Week, Month, All Time)
- [x] Add "Leaderboard" to Sidebar
- [x] Create Leaderboard API endpoint
- [x] Connect Leaderboard to real XP data
- [x] Make Leaderboard publicly accessible

## Phase 8: Security & Polish
- [x] Implement rate limiting (Redis Upstash)
- [ ] Add input sanitization
- [x] Configure security headers
- [x] Setup Sentry for error tracking
- [ ] Add API documentation with Elysia plugin
- [x] Mobile responsiveness check
- [x] Dark mode polish

## Phase 9: Deployment
- [x] Setup production environment variables
- [ ] Configure Vercel deployment
- [x] Test production build
- [ ] Deploy to Vercel
- [ ] Verify all features in production

## Phase 10: Bug Fixes & Polish
- [x] **Account Page**: Fix avatar image layout issue.
- [x] **Practice Detail**: Fix layout padding consistency.

## Phase 11: Public Pages & Data Integration
- [x] **Landing Page**: Add live data sections (Examples, Leaderboard, Translations)
- [x] **Public Rankings Page** (`/rankings`): Connect to real leaderboard API
- [x] **Public Library Page** (`/library`): Connect to real examples API
- [x] **Shared Components**: Create reusable LeaderboardItem and ExampleCard
- [x] **Public Feed**: Display recent public translations on landing page
- [x] **Data Consistency**: Ensure dashboard and public pages use same data source

