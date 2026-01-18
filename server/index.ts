import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { auth } from "./auth";
import { translationRoutes } from "./routes/translation";

// Better Auth middleware for session handling
const betterAuth = new Elysia({ name: "better-auth" })
	.mount(auth.handler)
	.macro(({ onBeforeHandle }) => ({
		auth(enabled: boolean) {
			if (!enabled) return;

			// biome-ignore lint/suspicious/noExplicitAny: Temporary fix for build
			return onBeforeHandle(async ({ request, set }: any) => {
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
	.use(betterAuth)
	.use(translationRoutes)
	.get("/api/health", () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
	}))
	// biome-ignore lint/suspicious/noExplicitAny: Temporary fix for build
	.get("/api/user", ({ user }: any) => user, {
		auth: true,
	});

export type App = typeof app;
export default app;
