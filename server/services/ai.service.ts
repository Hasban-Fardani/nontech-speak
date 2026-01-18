import { chat } from "@tanstack/ai";
import { createGeminiChat } from "@tanstack/ai-gemini";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { decrypt } from "./encryption.service";

export type AudienceType = "parent" | "partner" | "friend" | "child" | "boss";

const audiencePrompts: Record<AudienceType, string> = {
  parent:
    "You are explaining to a parent who has no technical background. Use simple, everyday analogies and avoid jargon completely.",
  partner:
    "You are explaining to a romantic partner who is curious but not technical. Use relatable examples and keep it conversational.",
  friend:
    "You are explaining to a friend who is interested but not in tech. Use casual language and fun analogies.",
  child:
    "You are explaining to a 10-year-old child. Use very simple words, fun examples, and make it easy to understand.",
  boss:
    "You are explaining to your boss or superior at work who may not be technical. Use professional language, business analogies, and focus on impact and outcomes.",
};

// Utility to get API Key - prioritize user's key over env
async function getApiKey(userId?: string): Promise<string> {
  // If userId provided, try to get user's API key
  if (userId) {
    try {
      const [user] = await db
        .select({ geminiApiKey: users.geminiApiKey })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user?.geminiApiKey) {
        // Decrypt and return user's key
        return decrypt(user.geminiApiKey);
      }
    } catch (error) {
      console.error("Error fetching user API key:", error);
      // Fall through to env key
    }
  }

  // Fall back to environment variable
  return process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
}

export async function translateTechnicalText(
  technicalText: string,
  audienceType: AudienceType,
  model: string = "gemini-2.0-flash",
  userId?: string,
) {
  const systemPrompt = `${audiencePrompts[audienceType]}

Your task is to take technical concepts and explain them in a way that is:
1. Easy to understand for the target audience
2. Accurate but simplified
3. Engaging and relatable
4. Free of technical jargon

Keep the explanation concise (2-3 paragraphs maximum).`;

  const stream = chat({
    adapter: createGeminiChat(
      model as
      | "gemini-2.0-flash"
      | "gemini-2.5-pro"
      | "gemini-2.5-flash"
      | "gemini-3-pro-preview"
      | "gemini-3-flash-preview",
      await getApiKey(userId),
    ),
    messages: [
      {
        role: "user",
        content: `${systemPrompt}\n\nExplain this technical concept: ${technicalText}`,
      },
    ],
  });

  return stream;
}

/**
 * Transcribe audio file using Gemini multimodal capabilities
 * TODO: Fix TypeScript types for TanStack AI multimodal content
 * Need to verify correct format for audio input in TanStack AI Gemini adapter
 */
export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
): Promise<string> {
  // Temporary implementation - return placeholder
  // Will implement proper Gemini audio transcription after verifying types
  throw new Error("Audio transcription not yet implemented - type issues to resolve");

  /*
  const stream = chat({
    adapter: createGeminiChat("gemini-2.0-flash", await getApiKey(userId)),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            value: "Transcribe this audio accurately.",
          },
          {
            type: "audio",
            source: { type: "data", value: audioBase64 },
            metadata: { mimeType },
          },
        ],
      },
    ],
  });

  let transcription = "";
  for await (const chunk of stream) {
    if (typeof chunk === "string") {
      transcription += chunk;
    } else if (chunk && typeof chunk === "object" && "content" in chunk) {
      transcription += chunk.content;
    }
  }

  return transcription.trim();
  */
}

export async function evaluatePractice(
  userExplanation: string,
  challengePrompt?: string,
) {
  const systemPrompt = `You are an expert at evaluating how well someone explains technical concepts to non-technical audiences.

Evaluate the explanation based on:
1. Clarity (0-25 points): Is it easy to understand?
2. Accuracy (0-25 points): Is the core concept correct?
3. Engagement (0-25 points): Is it interesting and relatable?
4. Simplicity (0-25 points): Does it avoid unnecessary jargon?

Provide:
- A total score out of 100
- Brief feedback (2-3 sentences)
- 2-3 specific suggestions for improvement

Format your response as JSON:
{
  "score": <number>,
  "feedback": "<string>",
  "suggestions": ["<string>", "<string>", "<string>"]
}`;

  const prompt = challengePrompt
    ? `Challenge: ${challengePrompt}\n\nUser's explanation: ${userExplanation}`
    : `Evaluate this explanation: ${userExplanation}`;

  const stream = chat({
    adapter: createGeminiChat("gemini-2.0-flash", await await getApiKey(userId)),
    messages: [
      {
        role: "user",
        content: `${systemPrompt}\n\n${prompt}`,
      },
    ],
  });

  return stream;
}
