import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of transactions in production

	// Session Replay
	replaysSessionSampleRate: 0.1, // 10% of sessions
	replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

	// Environment
	environment: process.env.NODE_ENV || "development",

	// Enable debug in development
	debug: process.env.NODE_ENV === "development",

	// Ignore common errors
	ignoreErrors: [
		// Browser extensions
		"top.GLOBALS",
		// Random plugins/extensions
		"originalCreateNotification",
		"canvas.contentDocument",
		"MyApp_RemoveAllHighlights",
		// Network errors
		"NetworkError",
		"Failed to fetch",
	],
});
