import { chat } from '@tanstack/ai';
import { createGeminiChat } from '@tanstack/ai-gemini';

export type AudienceType = 'parent' | 'partner' | 'friend' | 'child';

const audiencePrompts: Record<AudienceType, string> = {
  parent: 'You are explaining to a parent who has no technical background. Use simple, everyday analogies and avoid jargon completely.',
  partner: 'You are explaining to a romantic partner who is curious but not technical. Use relatable examples and keep it conversational.',
  friend: 'You are explaining to a friend who is interested but not in tech. Use casual language and fun analogies.',
  child: 'You are explaining to a 10-year-old child. Use very simple words, fun examples, and make it easy to understand.',
};

// Utility to get API Key
const getApiKey = () => process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || '';

export async function translateTechnicalText(
  technicalText: string,
  audienceType: AudienceType
) {
  const systemPrompt = `${audiencePrompts[audienceType]}

Your task is to take technical concepts and explain them in a way that is:
1. Easy to understand for the target audience
2. Accurate but simplified
3. Engaging and relatable
4. Free of technical jargon

Keep the explanation concise (2-3 paragraphs maximum).`;

  const stream = chat({
    adapter: createGeminiChat('gemini-2.0-flash', getApiKey()),
    messages: [
      {
        role: 'user',
        content: `${systemPrompt}\n\nExplain this technical concept: ${technicalText}`
      },
    ],
  });

  return stream;
}

export async function evaluatePractice(
  userExplanation: string,
  challengePrompt?: string
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
    adapter: createGeminiChat('gemini-2.0-flash', getApiKey()),
    messages: [
      {
        role: 'user',
        content: `${systemPrompt}\n\n${prompt}`
      },
    ],
  });

  return stream;
}
