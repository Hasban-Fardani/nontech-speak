import { desc, eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { challenges, practices, users } from "../db/schema";
import { checkRateLimit, getRateLimitIdentifier, rateLimiters } from "../lib/ratelimit";
import { evaluatePractice } from "../services/ai.service";

export const practiceRoutes = new Elysia({ prefix: "/api/practice" })
  /**
   * GET /api/practice/challenges
   * Get all active challenges
   */
  .get("/challenges", async ({ set }) => {
    try {
      const activeChallenges = await db
        .select()
        .from(challenges)
        .where(eq(challenges.isActive, true))
        .orderBy(challenges.difficulty, challenges.createdAt);

      return activeChallenges;
    } catch (error) {
      console.error("Fetch challenges error:", error);
      set.status = 500;
      return { error: "Failed to fetch challenges" };
    }
  })

  /**
   * POST /api/practice/submit
   * Submit practice answer and get AI feedback
   */
  .post(
    "/submit",
    async ({ body, request, set }) => {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      // Check rate limit (stricter for AI-powered endpoints)
      const identifier = getRateLimitIdentifier(request, session.user.id);
      const rateLimit = await checkRateLimit(rateLimiters.practice, identifier);

      if (!rateLimit.success) {
        set.status = 429;
        set.headers["X-RateLimit-Limit"] = rateLimit.limit?.toString() || "";
        set.headers["X-RateLimit-Remaining"] = rateLimit.remaining?.toString() || "";
        set.headers["X-RateLimit-Reset"] = rateLimit.reset?.toString() || "";
        return { error: "Too many practice submissions. Please wait before trying again." };
      }

      const { challengeId, userExplanation } = body;

      try {
        // Get challenge
        const [challenge] = await db
          .select()
          .from(challenges)
          .where(eq(challenges.id, challengeId))
          .limit(1);

        if (!challenge) {
          set.status = 404;
          return { error: "Challenge not found" };
        }

        // Get AI feedback stream
        const feedbackStream = await evaluatePractice(
          userExplanation,
          challenge.title,
          session.user.id,
        );

        // Consume stream to get full text response
        // Stream returns progressive JSON - each chunk has full JSON so far
        // We need the LAST complete JSON before 'done'
        let lastContent = "";
        for await (const chunk of feedbackStream) {
          // Extract content from chunk object
          if (chunk && typeof chunk === "object" && "content" in chunk) {
            lastContent = chunk.content; // Keep replacing with latest
          }
        }

        console.log("Full response before parse:", lastContent);

        // Clean and parse JSON response
        const cleanedResponse = lastContent
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        console.log("Cleaned response:", cleanedResponse);
        const feedback = JSON.parse(cleanedResponse);

        // Save practice
        const [practice] = await db
          .insert(practices)
          .values({
            userId: session.user.id,
            userInput: userExplanation,
            inputMethod: "text",
            feedbackText: feedback.explanation || feedback.feedback || "",
            score: feedback.score,
            suggestions: feedback.improvements || feedback.suggestions,
            challengePrompt: challenge.title,
          })
          .returning();

        // Update user XP
        await db
          .update(users)
          .set({
            totalXp: sql`${users.totalXp} + ${challenge.xpReward}`,
          })
          .where(eq(users.id, session.user.id));

        return {
          success: true,
          practice,
          feedback,
          xpEarned: challenge.xpReward,
        };
      } catch (error) {
        console.error("Submit practice error:", error);
        set.status = 500;
        return { error: "Failed to submit practice" };
      }
    },
    {
      body: t.Object({
        challengeId: t.String(),
        userExplanation: t.String(),
      }),
    },
  )

  /**
   * GET /api/practice/history
   * Get user's practice history
   */
  .get("/history", async ({ request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    try {
      const history = await db
        .select()
        .from(practices)
        .where(eq(practices.userId, session.user.id))
        .orderBy(desc(practices.createdAt))
        .limit(50);

      return history;
    } catch (error) {
      console.error("Fetch history error:", error);
      set.status = 500;
      return { error: "Failed to fetch history" };
    }
  })

  /**
   * GET /api/practice/:id
   * Get specific practice result
   */
  .get("/:id", async ({ params, request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const { id } = params;

    try {
      const [practice] = await db
        .select()
        .from(practices)
        .where(eq(practices.id, id))
        .limit(1);

      if (!practice) {
        set.status = 404;
        return { error: "Practice not found" };
      }

      // Check ownership
      if (practice.userId !== session.user.id) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      return practice;
    } catch (error) {
      console.error("Fetch practice error:", error);
      set.status = 500;
      return { error: "Failed to fetch practice" };
    }
  });
