# Non-Tech Speak: The Art of Explaining Simply 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![Bun](https://img.shields.io/badge/Runtime-Bun-f472b6)
![Elysia](https://img.shields.io/badge/Backend-ElysiaJS-blueviolet)

> *"I couldn't explain it to the freshmen. That means we don't really understand it."* — **Richard Feynman**

**Non-Tech Speak** is an AI-powered platform designed to bridge the gap between technical complexity and simple understanding. Inspired by Richard Feynman's philosophy, it transforms dense technical jargon into relatable, context-aware analogies for various audiences—from a 5-year-old child to a busy CEO.

---

## ✨ Key Features

- **Context-Aware Translations**: Converts technical concepts into analogies tailored to specific personas (e.g., "Like a pizza delivery service" for APIs).
- **Multi-Persona Support**: Explanations for different audiences: 5-Year-Old, Grandmother, Non-Tech Manager, etc.
- **Real-time Streaming**: Instant feedback using AI streaming (Google Gemini 2.0 Flash).
- **Social Learning**: Public feed of popular translations, upvoting system, and shared wisdom.
- **Atomic Design UI**: Beautiful, consistent interface built with Shadcn UI and Tailwind CSS.
- **Performance First**: Built on Bun and ElysiaJS for maximum speed and low latency.

---

## 🛠️ The Tech Stack

We prioritized speed, type safety, and modern developer experience.

| Category | Technology | Description |
|----------|------------|-------------|
| **Runtime** | ![Bun](https://img.shields.io/badge/-Bun-black?style=flat&logo=bun) | Ultra-fast JavaScript runtime & bundler. |
| **Frontend** | ![Next.js](https://img.shields.io/badge/-Next.js_16-black?style=flat&logo=next.js) | App Router for reactive, server-first UI. |
| **Backend** | ![Elysia](https://img.shields.io/badge/-ElysiaJS-blueviolet?style=flat) | High-performance TypeScript framework. |
| **Database** | ![Neon](https://img.shields.io/badge/-Neon_Postgres-00E599?style=flat&logo=postgresql) | Serverless Postgres managed via **Drizzle ORM**. |
| **AI Engine** | ![Gemini](https://img.shields.io/badge/-Gemini_2.0-8E75B2?style=flat&logo=google) | Powered by Google Gemini via `@tanstack/ai`. |
| **Auth** | ![Better Auth](https://img.shields.io/badge/-Better_Auth-success?style=flat) | Robust, type-safe authentication. |
| **Styling** | ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css) | Utility-first CSS with **Shadcn UI**. |
| **Rate Limiting** | ![Upstash](https://img.shields.io/badge/-Upstash_Redis-00E9A3?style=flat) | Redis for rate limiting and caching. |

---

## 📂 Project Structure

The project follows a Monorepo-style hybrid architecture, separating the Next.js frontend from the Elysia backend logic while keeping them in the same codebase for cohesion.

```bash
.
├── app/                  # Next.js App Router (Frontend)
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Protected dashboard & app core
│   ├── api/              # Next.js API routes (proxies)
│   └── page.tsx          # Landing page
├── server/               # Content & Backend Logic (Elysia)
│   ├── routes/           # API Endpoints (Translation, History, etc.)
│   ├── db/               # Database Schema & Drizzle Config
│   └── services/         # Business logic & AI Integration
├── components/           # Atomic Design System
│   ├── atoms/            # Basic building blocks (Buttons, Inputs)
│   ├── molecules/        # Combinations (Search bars, Cards)
│   ├── organisms/        # Complex sections (Forms, Sidebars)
│   └── templates/        # Page layouts
├── public/               # Static Assets
└── lib/                  # Shared Utilities
```

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- **Bun**: This project uses [Bun](https://bun.sh) as the package manager and runtime.
- **PostgreSQL**: Ensure you have a Postgres instance running (or use Neon).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/non-tech-speak.git
   cd non-tech-speak
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up Environment Variables**
   Copy the example environment file and fill in your secrets.
   ```bash
   cp .env.example .env.local
   ```
   *See `.env.example` for the full list of required keys (Database, AI Keys, Auth Secrets).*

4. **Initialize the Database**
   ```bash
   bun run db:generate
   bun run db:push
   ```

5. **Run the Development Server**
   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧠 Why This Stack?

- **Hybrid Architecture**: We use Next.js for SEO and initial rendering, while heavy logic and AI streaming are handled by ElysiaJS. This gives us the best of both worlds: great SEO and raw API performance.
- **Feynman Technique**: The core of the app is built around the idea that "complexity is a mask for lack of understanding." The AI is prompted not just to translate, but to *teach*.

## 🤝 Contributing

Contributions are welcome! Please run `bunx biome check .` before submitting a PR to ensure code quality.

## 📄 License

This project is licensed under the MIT License.
