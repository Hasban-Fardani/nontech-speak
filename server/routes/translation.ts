import { desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { translations } from "../db/schema";
import {
	checkRateLimit,
	getRateLimitIdentifier,
	rateLimiters,
} from "../lib/ratelimit";
import { translateTechnicalText } from "../services/ai.service";

export const translationRoutes = new Elysia({ prefix: "/api/translation" })
	.post(
		"/create",
		async ({ body, request, set }) => {
			// Validate session
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			// Check rate limit
			const identifier = getRateLimitIdentifier(request, session.user.id);
			const rateLimit = await checkRateLimit(
				rateLimiters.translation,
				identifier,
			);

			if (!rateLimit.success) {
				set.status = 429;
				set.headers["X-RateLimit-Limit"] = rateLimit.limit?.toString() || "";
				set.headers["X-RateLimit-Remaining"] =
					rateLimit.remaining?.toString() || "";
				set.headers["X-RateLimit-Reset"] = rateLimit.reset?.toString() || "";
				return { error: "Too many requests. Please try again later." };
			}

			const { technicalText, audienceType, model, isPublic, audioFileId } =
				body;

			try {
				// Call AI service with validated inputs (TypeBox already validated)
				const stream = await translateTechnicalText(
					technicalText,
					audienceType,
					model || "gemini-2.0-flash",
					session.user.id,
				);

				// Consume stream to get full text
				let simplifiedText = "";

				for await (const chunk of stream) {
					// Check for error chunk
					if (
						chunk &&
						typeof chunk === "object" &&
						"type" in chunk &&
						chunk.type === "error"
					) {
						const errorMessage = chunk.error?.message || "Unknown stream error";
						throw new Error(`AI Stream Error: ${errorMessage}`);
					}

					let content = "";
					if (typeof chunk === "string") {
						content = chunk;
					} else if (chunk && typeof chunk === "object" && "content" in chunk) {
						content = chunk.content;
					}

					if (content) {
						// Check if content is accumulated (starts with what we have so far)
						// or if it's a delta (append it)
						if (simplifiedText && content.startsWith(simplifiedText)) {
							simplifiedText = content;
						} else {
							simplifiedText += content;
						}
					}
				}

				if (!simplifiedText) {
					throw new Error(
						"Translation failed: No content generated (likely API quota limit)",
					);
				}

				// Save to database
				const [newTranslation] = await db
					.insert(translations)
					.values({
						userId: session.user.id,
						technicalText,
						simplifiedText,
						audienceType,
						inputMethod: audioFileId ? "voice" : "text",
						audioFileId: audioFileId || null,
						isPublic: isPublic ?? false,
						aiModel: model || "gemini-2.0-flash",
					})
					.returning();

				return {
					success: true,
					data: newTranslation,
				};
			} catch (error) {
				console.error("Translation error:", error);

				// Check if it's an API quota error
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";

				if (
					errorMessage.includes("quota") ||
					errorMessage.includes("RESOURCE_EXHAUSTED")
				) {
					set.status = 429;
					return {
						error:
							"API quota exceeded. Please try again later or upgrade your plan.",
					};
				}

				if (errorMessage.includes("AI Stream Error")) {
					// Extract the actual error message
					const match = errorMessage.match(/AI Stream Error: (.+)/);
					const actualError = match ? match[1] : errorMessage;
					set.status = 500;
					return { error: actualError };
				}

				set.status = 500;
				return { error: "Translation failed. Please try again." };
			}
		},
		{
			body: t.Object({
				technicalText: t.String({ minLength: 10, maxLength: 5000 }),
				audienceType: t.Union([
					t.Literal("parent"),
					t.Literal("partner"),
					t.Literal("friend"),
					t.Literal("child"),
					t.Literal("boss"),
				]),
				model: t.Optional(
					t.Union([
						t.Literal("gemini-2.0-flash"),
						t.Literal("gemini-2.5-flash"),
						t.Literal("gemini-3-flash-preview"),
					]),
				),
				isPublic: t.Optional(t.Boolean()),
				audioFileId: t.Optional(t.String()),
			}),
		},
	)

	/**
	 * PATCH /api/translation/:id/visibility
	 * Toggle translation public/private status
	 */
	.patch(
		"/:id/visibility",
		async ({ params, body, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			const { id } = params;
			const { isPublic } = body;

			try {
				// Verify ownership
				const [translation] = await db
					.select()
					.from(translations)
					.where(eq(translations.id, id))
					.limit(1);

				if (!translation) {
					set.status = 404;
					return { error: "Translation not found" };
				}

				if (translation.userId !== session.user.id) {
					set.status = 403;
					return { error: "Forbidden: You don't own this translation" };
				}

				// Update visibility
				const [updated] = await db
					.update(translations)
					.set({ isPublic, updatedAt: new Date() })
					.where(eq(translations.id, id))
					.returning();

				return {
					success: true,
					data: updated,
				};
			} catch (error) {
				console.error("Update visibility error:", error);
				set.status = 500;
				return { error: "Failed to update visibility" };
			}
		},
		{
			body: t.Object({
				isPublic: t.Boolean(),
			}),
		},
	)

	/**
	 * GET /api/translation/:id
	 * Get single translation by ID
	 */
	.get("/:id", async ({ params, request, set }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			set.status = 401;
			return { error: "Unauthorized" };
		}

		const { id } = params;

		try {
			const [translation] = await db
				.select()
				.from(translations)
				.where(eq(translations.id, id))
				.limit(1);

			if (!translation) {
				set.status = 404;
				return { error: "Translation not found" };
			}

			// Verify ownership
			if (translation.userId !== session.user.id) {
				set.status = 403;
				return { error: "Forbidden: You don't own this translation" };
			}

			return translation;
		} catch (error) {
			console.error("Get translation error:", error);
			set.status = 500;
			return { error: "Failed to fetch translation" };
		}
	})

	/**
	 * DELETE /api/translation/:id
	 * Delete translation
	 */
	.delete("/:id", async ({ params, request, set }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			set.status = 401;
			return { error: "Unauthorized" };
		}

		const { id } = params;

		try {
			// Verify ownership
			const [translation] = await db
				.select()
				.from(translations)
				.where(eq(translations.id, id))
				.limit(1);

			if (!translation) {
				set.status = 404;
				return { error: "Translation not found" };
			}

			if (translation.userId !== session.user.id) {
				set.status = 403;
				return { error: "Forbidden: You don't own this translation" };
			}

			// Delete translation (cascade will handle related records)
			await db.delete(translations).where(eq(translations.id, id));

			return {
				success: true,
				message: "Translation deleted successfully",
			};
		} catch (error) {
			console.error("Delete translation error:", error);
			set.status = 500;
			return { error: "Failed to delete translation" };
		}
	})

	.get("/list", async ({ query, request, set }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			set.status = 401;
			return { error: "Unauthorized" };
		}

		const page = Number(query.page) || 1;
		const limit = Number(query.limit) || 10;

		const userTranslations = await db
			.select()
			.from(translations)
			.where(eq(translations.userId, session.user.id))
			.orderBy(desc(translations.createdAt))
			.limit(limit)
			.offset((page - 1) * limit);

		return userTranslations;
	});
