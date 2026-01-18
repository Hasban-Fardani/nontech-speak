import { desc, gte, type SQL } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";

export const leaderboardRoutes = new Elysia({ prefix: "/api/leaderboard" })
	/**
	 * GET /api/leaderboard
	 * Get leaderboard rankings by period
	 */
	.get(
		"/",
		async ({ query, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			const { period = "all_time" } = query;

			try {
				// Calculate date filter based on period
				let dateFilter: SQL | undefined;
				const now = new Date();

				switch (period) {
					case "today": {
						const startOfToday = new Date(now.setHours(0, 0, 0, 0));
						dateFilter = gte(users.updatedAt, startOfToday);
						break;
					}
					case "week": {
						const startOfWeek = new Date(now);
						startOfWeek.setDate(now.getDate() - 7);
						dateFilter = gte(users.updatedAt, startOfWeek);
						break;
					}
					case "month": {
						const startOfMonth = new Date(now);
						startOfMonth.setMonth(now.getMonth() - 1);
						dateFilter = gte(users.updatedAt, startOfMonth);
						break;
					}

					default:
						dateFilter = undefined;
						break;
				}

				// Fetch top users by XP
				const leaderboard = await db
					.select({
						id: users.id,
						name: users.name,
						image: users.image,
						totalXp: users.totalXp,
					})
					.from(users)
					.where(dateFilter)
					.orderBy(desc(users.totalXp))
					.limit(100);

				// Add rank and format response
				const rankedLeaderboard = leaderboard.map((user, index) => ({
					rank: index + 1,
					user: {
						id: user.id,
						name: user.name,
						avatar: user.image || "",
						initials: user.name
							.split(" ")
							.map((n) => n[0])
							.join("")
							.toUpperCase()
							.slice(0, 2),
					},
					xp: user.totalXp,
					isCurrentUser: user.id === session.user.id,
				}));

				return rankedLeaderboard;
			} catch (error) {
				console.error("Fetch leaderboard error:", error);
				set.status = 500;
				return { error: "Failed to fetch leaderboard" };
			}
		},
		{
			query: t.Object({
				period: t.Optional(
					t.Union([
						t.Literal("today"),
						t.Literal("week"),
						t.Literal("month"),
						t.Literal("all_time"),
					]),
				),
			}),
		},
	);
