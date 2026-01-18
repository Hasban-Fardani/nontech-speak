import { chat } from "@tanstack/ai";
import { createGeminiChat } from "@tanstack/ai-gemini";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { isModelAllowed } from "../lib/model-validator";
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
	boss: "You are explaining to your boss or superior at work who may not be technical. Use professional language, business analogies, and focus on impact and outcomes.",
};

// Utility to get API Key - prioritize user's key over env
async function getApiKey(
	userId?: string,
): Promise<{ apiKey: string; hasUserKey: boolean }> {
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
				return {
					apiKey: decrypt(user.geminiApiKey),
					hasUserKey: true,
				};
			}
		} catch (error) {
			console.error("Error fetching user API key:", error);
			throw error;
		}
	}

	// Fall back to environment variable
	return {
		apiKey: process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || "",
		hasUserKey: false,
	};
}

export async function translateTechnicalText(
	technicalText: string,
	audienceType: AudienceType,
	model: string = "gemini-2.0-flash",
	userId?: string,
) {
	// Get API key and check if user has their own
	const { apiKey, hasUserKey } = await getApiKey(userId);

	// Validate model is allowed
	if (!isModelAllowed(model, hasUserKey)) {
		throw new Error(
			`Model ${model} is not available. Please use your own API key in Settings to access Pro models, or use Flash models (gemini-2.0-flash, gemini-2.5-flash, gemini-3-flash-preview).`,
		);
	}

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
				| "gemini-2.5-flash"
				| "gemini-3-flash-preview",
			apiKey,
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
	_audioBase64: string,
	_mimeType: string,
): Promise<string> {
	// Temporary implementation - return placeholder
	// Will implement proper Gemini audio transcription after verifying types
	throw new Error(
		"Audio transcription not yet implemented - type issues to resolve",
	);

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
	userId?: string,
) {
	const systemPrompt = `You are an expert at evaluating how well someone explains technical concepts to non-technical audiences.

Evaluate the explanation based on:
1. Clarity (0-25 points): Is it easy to understand?
2. Accuracy (0-25 points): Is the core concept correct?
3. Engagement (0-25 points): Is it interesting and relatable?
4. Simplicity (0-25 points): Does it avoid unnecessary jargon?

CRITICAL: You MUST respond with ONLY a valid JSON object. Do NOT include any markdown, explanations, or text before or after the JSON.

Your response must be EXACTLY in this format (example):
{"score": 85, "explanation": "Great analogy! Clear and relatable.", "strengths": ["Simple language", "Good analogy"], "improvements": ["Could be more detailed", "Add more examples"]}

Required JSON structure:
- score: number (0-100)
- explanation: string (2-3 sentences)
- strengths: array of 2-3 strings
- improvements: array of 2-3 strings`;

	const prompt = challengePrompt
		? `Challenge: ${challengePrompt}\n\nUser's explanation: ${userExplanation}\n\nRespond with ONLY the JSON object, nothing else.`
		: `Evaluate this explanation: ${userExplanation}\n\nRespond with ONLY the JSON object, nothing else.`;

	// Get API key
	const { apiKey } = await getApiKey(userId);

	const stream = chat({
		adapter: createGeminiChat("gemini-2.0-flash", apiKey),
		messages: [
			{
				role: "user",
				content: `${systemPrompt}\n\n${prompt}`,
			},
		],
	});

	return stream;
}
