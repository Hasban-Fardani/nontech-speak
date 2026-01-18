import { desc, eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { translations, users } from "../db/schema";
import {
	checkRateLimit,
	getRateLimitIdentifier,
	rateLimiters,
} from "../lib/ratelimit";

export const shareRoutes = new Elysia({ prefix: "/api" })
	/**
	 * GET /api/share/:id
	 * Public endpoint to view shared translation
	 * - No authentication required
	 * - Owner cannot view own private translation via share link
	 * - Increments view count
	 */
	.get("/share/:id", async ({ params, request, set }) => {
		// Rate limit public endpoints
		const identifier = getRateLimitIdentifier(request);
		const rateLimit = await checkRateLimit(rateLimiters.public, identifier);

		if (!rateLimit.success) {
			set.status = 429;
			return { error: "Too many requests. Please try again later." };
		}

		const { id } = params;

		try {
			// Fetch translation
			const [translation] = await db
				.select()
				.from(translations)
				.where(eq(translations.id, id))
				.limit(1);

			if (!translation) {
				set.status = 404;
				return { error: "Translation not found" };
			}

			// Check if translation is public
			if (!translation.isPublic) {
				// Get current user session (if any)
				const session = await auth.api.getSession({ headers: request.headers });

				// If owner tries to access own private translation via share link
				if (session && session.user.id === translation.userId) {
					set.status = 403;
					return {
						error:
							"Cannot view your own private translation via share link. Please use the dashboard.",
					};
				}

				// Not public and not owner
				set.status = 403;
				return { error: "This translation is private" };
			}

			// Increment view count (async, non-blocking)
			db.update(translations)
				.set({ viewCount: translation.viewCount + 1 })
				.where(eq(translations.id, id))
				.then(() => {})
				.catch((err) => console.error("Failed to increment view count:", err));

			// Return limited fields for security
			return {
				id: translation.id,
				technicalText: translation.technicalText,
				simplifiedText: translation.simplifiedText,
				audienceType: translation.audienceType,
				aiModel: translation.aiModel,
				viewCount: translation.viewCount,
				upvotesCount: translation.upvotesCount,
				createdAt: translation.createdAt,
			};
		} catch (error) {
			console.error("Share fetch error:", error);
			set.status = 500;
			return { error: "Failed to fetch shared translation" };
		}
	})

	/**
	 * GET /api/public/feed
	 * Get public translations for landing page
	 * - No authentication required
	 * - Returns only public translations
	 * - Includes limited user info
	 */
	.get("/public/feed", async ({ query, set }) => {
		const limit = Math.min(Number(query.limit) || 10, 50); // Max 50

		try {
			const publicTranslations = await db
				.select({
					id: translations.id,
					technicalText: translations.technicalText,
					simplifiedText: translations.simplifiedText,
					audienceType: translations.audienceType,
					aiModel: translations.aiModel,
					viewCount: translations.viewCount,
					upvotesCount: translations.upvotesCount,
					createdAt: translations.createdAt,
					user: {
						name: users.name,
						image: users.image,
					},
				})
				.from(translations)
				.leftJoin(users, eq(translations.userId, users.id))
				.where(eq(translations.isPublic, true))
				.orderBy(desc(translations.createdAt))
				.limit(limit);

			return publicTranslations;
		} catch (error) {
			console.error("Public feed error:", error);
			set.status = 500;
			return { error: "Failed to fetch public feed" };
		}
	});
