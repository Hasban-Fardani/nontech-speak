import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { type Context, Elysia } from "elysia";
import { auth } from "./auth";
import { audioRoutes } from "./routes/audio";
import { leaderboardRoutes } from "./routes/leaderboard";
import { practiceRoutes } from "./routes/practice";
import { shareRoutes } from "./routes/share";
import { translationRoutes } from "./routes/translation";
import { userRoutes } from "./routes/user";
import { voteRoutes } from "./routes/vote";

// Better Auth middleware for session handling
const betterAuth = new Elysia({ name: "better-auth" })
	.mount(auth.handler)
	.macro(({ onBeforeHandle }) => ({
		auth(enabled: boolean) {
			if (!enabled) return;

			return onBeforeHandle(async ({ request, set }: Context) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				return {
					user: session.user,
					session: session.session,
				};
			});
		},
	}));

const app = new Elysia()
	.use(
		cors({
			origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(openapi())
	.use(betterAuth)
	.use(translationRoutes)
	.use(audioRoutes)
	.use(shareRoutes)
	.use(userRoutes)
	.use(voteRoutes)
	.use(practiceRoutes)
	.use(leaderboardRoutes)
	.get("/api/health", () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
	}))
	.get(
		"/api/user",
		(c) => {
			return (
				c as unknown as {
					user: {
						id: string;
						email: string;
						name: string;
						image?: string | null;
					};
				}
			).user;
		},
		{
			auth: true,
		},
	);

export type App = typeof app;
export default app;
