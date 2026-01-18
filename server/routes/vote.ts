import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { translations, translationVotes } from "../db/schema";

export const voteRoutes = new Elysia({ prefix: "/api/translation" })
	/**
	 * POST /api/translation/:id/vote
	 * Upvote or downvote a translation
	 */
	.post(
		"/:id/vote",
		async ({ params, body, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			const { id } = params;
			const { voteType } = body;

			try {
				// Check if translation exists
				const [translation] = await db
					.select()
					.from(translations)
					.where(eq(translations.id, id))
					.limit(1);

				if (!translation) {
					set.status = 404;
					return { error: "Translation not found" };
				}

				// Check existing vote
				const [existingVote] = await db
					.select()
					.from(translationVotes)
					.where(
						and(
							eq(translationVotes.userId, session.user.id),
							eq(translationVotes.translationId, id),
						),
					)
					.limit(1);

				if (existingVote) {
					if (existingVote.voteType === voteType) {
						// Remove vote if clicking same button
						await db
							.delete(translationVotes)
							.where(eq(translationVotes.id, existingVote.id));

						// Update upvotes count
						await db
							.update(translations)
							.set({
								upvotesCount:
									voteType === "up"
										? translation.upvotesCount - 1
										: translation.upvotesCount + 1,
							})
							.where(eq(translations.id, id));

						return {
							success: true,
							voteType: null,
							upvotesCount:
								voteType === "up"
									? translation.upvotesCount - 1
									: translation.upvotesCount + 1,
						};
					}
					// Change vote type
					await db
						.update(translationVotes)
						.set({ voteType })
						.where(eq(translationVotes.id, existingVote.id));

					// Update upvotes count (swing by 2)
					const newCount =
						voteType === "up"
							? translation.upvotesCount + 2
							: translation.upvotesCount - 2;

					await db
						.update(translations)
						.set({ upvotesCount: newCount })
						.where(eq(translations.id, id));

					return {
						success: true,
						voteType,
						upvotesCount: newCount,
					};
				}

				// Create new vote
				await db.insert(translationVotes).values({
					userId: session.user.id,
					translationId: id,
					voteType,
				});

				// Update upvotes count
				const newCount =
					voteType === "up"
						? translation.upvotesCount + 1
						: translation.upvotesCount - 1;

				await db
					.update(translations)
					.set({ upvotesCount: newCount })
					.where(eq(translations.id, id));

				return {
					success: true,
					voteType,
					upvotesCount: newCount,
				};
			} catch (error) {
				console.error("Vote error:", error);
				set.status = 500;
				return { error: "Failed to process vote" };
			}
		},
		{
			body: t.Object({
				voteType: t.Union([t.Literal("up"), t.Literal("down")]),
			}),
		},
	)

	/**
	 * GET /api/translation/:id/vote
	 * Get user's vote status for a translation
	 */
	.get("/:id/vote", async ({ params, request, set }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			return { voteType: null };
		}

		const { id } = params;

		try {
			const [vote] = await db
				.select()
				.from(translationVotes)
				.where(
					and(
						eq(translationVotes.userId, session.user.id),
						eq(translationVotes.translationId, id),
					),
				)
				.limit(1);

			return {
				voteType: vote?.voteType || null,
			};
		} catch (error) {
			console.error("Get vote error:", error);
			set.status = 500;
			return { error: "Failed to get vote status" };
		}
	});
