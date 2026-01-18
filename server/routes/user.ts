import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";
import { encrypt } from "../services/encryption.service";

export const userRoutes = new Elysia({ prefix: "/api/user" })
	/**
	 * PATCH /api/user/settings
	 * Update user settings including API keys
	 */
	.patch(
		"/settings",
		async ({ body, request, set }) => {
			// Validate session
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			const { geminiApiKey } = body;

			try {
				// Prepare update data
				const updateData: { geminiApiKey?: string; updatedAt: Date } = {
					updatedAt: new Date(),
				};

				// Encrypt API key if provided
				if (geminiApiKey !== undefined) {
					if (geminiApiKey === null || geminiApiKey === "") {
						// Allow clearing the API key
						updateData.geminiApiKey = undefined;
					} else {
						// Encrypt and save
						updateData.geminiApiKey = encrypt(geminiApiKey);
					}
				}

				// Update user record
				await db
					.update(users)
					.set(updateData)
					.where(eq(users.id, session.user.id));

				return {
					success: true,
					message: geminiApiKey
						? "API key saved successfully. For security reasons, it cannot be viewed after input."
						: "Settings updated successfully",
				};
			} catch (error) {
				console.error("Update settings error:", error);
				set.status = 500;
				return { error: "Failed to update settings" };
			}
		},
		{
			body: t.Object({
				geminiApiKey: t.Optional(t.Union([t.String(), t.Null()])),
			}),
		},
	)

	/**
	 * GET /api/user/settings
	 * Get user settings (without sensitive data)
	 */
	.get("/settings", async ({ request, set }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			set.status = 401;
			return { error: "Unauthorized" };
		}

		try {
			const [user] = await db
				.select({
					id: users.id,
					email: users.email,
					name: users.name,
					image: users.image,
					hasGeminiApiKey: users.geminiApiKey, // Just check if exists
				})
				.from(users)
				.where(eq(users.id, session.user.id))
				.limit(1);

			if (!user) {
				set.status = 404;
				return { error: "User not found" };
			}

			return {
				...user,
				hasGeminiApiKey: !!user.hasGeminiApiKey, // Convert to boolean
			};
		} catch (error) {
			console.error("Get settings error:", error);
			set.status = 500;
			return { error: "Failed to fetch settings" };
		}
	});
