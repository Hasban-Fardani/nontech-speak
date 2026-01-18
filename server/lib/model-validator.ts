// List of Pro models that require user's own API key
const _PRO_MODELS = ["gemini-2.5-pro", "gemini-3-pro-preview"];

// List of allowed models for env token (Flash models only)
const FLASH_MODELS = [
	"gemini-2.0-flash",
	"gemini-2.5-flash",
	"gemini-3-flash-preview",
];

/**
 * Check if a model is allowed based on whether user has their own API key
 * @param model - The model name to check
 * @param hasUserApiKey - Whether the user has their own API key
 * @returns true if model is allowed, false otherwise
 */
export function isModelAllowed(model: string, hasUserApiKey: boolean): boolean {
	// If user has their own API key, allow all models
	if (hasUserApiKey) {
		return true;
	}

	// If using env token, only allow Flash models
	return FLASH_MODELS.includes(model);
}

/**
 * Get default model based on whether user has API key
 */
export function getDefaultModel(hasUserApiKey: boolean): string {
	return hasUserApiKey ? "gemini-2.5-pro" : "gemini-2.0-flash";
}
