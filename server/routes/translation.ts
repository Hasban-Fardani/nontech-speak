import { desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { translations } from "../db/schema";
import {
	type AudienceType,
	translateTechnicalText,
} from "../services/ai.service";

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

			const { technicalText, audienceType } = body;

			try {
				// Call AI service
				const stream = await translateTechnicalText(
					technicalText,
					audienceType,
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
						// @ts-expect-error
						const errorMessage = chunk.error?.message || "Unknown stream error";
						throw new Error(`AI Stream Error: ${errorMessage}`);
					}

					if (typeof chunk === "string") {
						simplifiedText += chunk;
					} else if (chunk && typeof chunk === "object" && "content" in chunk) {
						// @ts-expect-error
						simplifiedText += chunk.content;
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
						inputMethod: "text",
						isPublic: false,
						aiModel: "gemini-2.0-flash",
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
				technicalText: t.String({ minLength: 1, maxLength: 5000 }),
				audienceType: t.Union([
					t.Literal("parent"),
					t.Literal("partner"),
					t.Literal("friend"),
					t.Literal("child"),
				]),
			}),
		},
	)
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
