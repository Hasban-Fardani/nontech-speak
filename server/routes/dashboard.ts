import { and, count, desc, eq, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { practices, translations } from "../db/schema";

export const dashboardRoutes = new Elysia({ prefix: "/api/dashboard" })
	/**
	 * GET /api/dashboard/stats
	 * Get user dashboard statistics
	 */
	.get("/stats", async ({ request, set }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			set.status = 401;
			return { error: "Unauthorized" };
		}

		const userId = session.user.id;

		try {
			// Get translations count
			const [translationsCount] = await db
				.select({ count: count() })
				.from(translations)
				.where(eq(translations.userId, userId));

			// Get practice sessions count
			const [practiceCount] = await db
				.select({ count: count() })
				.from(practices)
				.where(eq(practices.userId, userId));

			// Get saved examples count (public translations)
			const [savedCount] = await db
				.select({ count: count() })
				.from(translations)
				.where(
					and(eq(translations.userId, userId), eq(translations.isPublic, true)),
				);

			// Get average practice score
			const [avgScore] = await db
				.select({
					avg: sql<number>`COALESCE(AVG(${practices.score}), 0)`,
				})
				.from(practices)
				.where(eq(practices.userId, userId));

			return {
				translations: translationsCount?.count || 0,
				practiceSessions: practiceCount?.count || 0,
				savedExamples: savedCount?.count || 0,
				averageScore: avgScore?.avg ? Math.round(avgScore.avg) : 0,
			};
		} catch (error) {
			console.error("Dashboard stats error:", error);
			set.status = 500;
			return { error: "Failed to fetch dashboard stats" };
		}
	})

	/**
	 * GET /api/dashboard/activity
	 * Get recent user activity (translations + practice sessions)
	 */
	.get("/activity", async ({ request, set, query }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			set.status = 401;
			return { error: "Unauthorized" };
		}

		const userId = session.user.id;
		const limit = Math.min(Number(query.limit) || 10, 20);

		try {
			// Get recent translations
			const recentTranslations = await db
				.select({
					id: translations.id,
					type: sql<string>`'translation'`,
					title: translations.technicalText,
					audience: translations.audienceType,
					createdAt: translations.createdAt,
				})
				.from(translations)
				.where(eq(translations.userId, userId))
				.orderBy(desc(translations.createdAt))
				.limit(limit);

			// Get recent practice sessions
			const recentPractice = await db
				.select({
					id: practices.id,
					type: sql<string>`'practice'`,
					title: sql<string>`'Practice Session'`,
					score: practices.score,
					createdAt: practices.createdAt,
				})
				.from(practices)
				.where(eq(practices.userId, userId))
				.orderBy(desc(practices.createdAt))
				.limit(limit);

			// Combine and sort by date
			const combined = [
				...recentTranslations.map((t) => ({
					id: t.id,
					type: t.type,
					title:
						t.title.substring(0, 100) + (t.title.length > 100 ? "..." : ""),
					audience: t.audience,
					createdAt: t.createdAt,
				})),
				...recentPractice.map((p) => ({
					id: p.id,
					type: p.type,
					title: p.title,
					score: p.score,
					createdAt: p.createdAt,
				})),
			]
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				)
				.slice(0, limit);

			return combined;
		} catch (error) {
			console.error("Dashboard activity error:", error);
			set.status = 500;
			return { error: "Failed to fetch recent activity" };
		}
	});
