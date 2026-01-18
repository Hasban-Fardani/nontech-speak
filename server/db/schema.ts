import { createId } from "@paralleldrive/cuid2";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

// Enums
export const audienceTypeEnum = pgEnum("audience_type", [
	"parent",
	"partner",
	"friend",
	"child",
	"boss",
]);
export const inputMethodEnum = pgEnum("input_method", ["text", "voice"]);
export const transcriptionStatusEnum = pgEnum("transcription_status", [
	"pending",
	"processing",
	"completed",
	"failed",
]);

// Users table
export const users = pgTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified").notNull().default(false),
		name: text("name").notNull(),
		image: text("image"),
		geminiApiKey: text("gemini_api_key"), // Encrypted user API key
		totalXp: integer("total_xp").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		emailIdx: index("users_email_idx").on(table.email),
	}),
);

// Sessions table
export const sessions = pgTable(
	"sessions",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		token: text("token").notNull().unique(),
		expiresAt: timestamp("expires_at").notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("sessions_user_id_idx").on(table.userId),
		tokenIdx: index("sessions_token_idx").on(table.token),
		expiresAtIdx: index("sessions_expires_at_idx").on(table.expiresAt),
	}),
);

// Accounts table (for OAuth)
export const accounts = pgTable(
	"accounts",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		scope: text("scope"),
		idToken: text("id_token"),
		password: text("password"),
		expiresAt: timestamp("expires_at"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("accounts_user_id_idx").on(table.userId),
	}),
);

// Verification tokens table
export const verificationTokens = pgTable("verification_tokens", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Audio files table
export const audioFiles = pgTable(
	"audio_files",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		fileUrl: text("file_url").notNull(),
		fileSize: integer("file_size").notNull(),
		duration: integer("duration"),
		mimeType: text("mime_type").notNull(),
		originalFilename: text("original_filename").notNull(),
		transcriptionText: text("transcription_text"),
		transcriptionStatus: transcriptionStatusEnum("transcription_status")
			.notNull()
			.default("pending"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("audio_files_user_id_idx").on(table.userId),
		statusIdx: index("audio_files_status_idx").on(table.transcriptionStatus),
		createdAtIdx: index("audio_files_created_at_idx").on(table.createdAt),
	}),
);

// Translations table
export const translations = pgTable(
	"translations",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		technicalText: text("technical_text").notNull(),
		simplifiedText: text("simplified_text").notNull(),
		audienceType: audienceTypeEnum("audience_type").notNull(),
		inputMethod: inputMethodEnum("input_method").notNull(),
		audioFileId: text("audio_file_id").references(() => audioFiles.id, {
			onDelete: "set null",
		}),
		isPublic: boolean("is_public").notNull().default(false),
		upvotesCount: integer("upvotes_count").notNull().default(0),
		viewCount: integer("view_count").notNull().default(0),
		aiModel: text("ai_model"),
		tokensUsed: integer("tokens_used"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("translations_user_id_idx").on(table.userId),
		isPublicIdx: index("translations_is_public_idx").on(table.isPublic),
		createdAtIdx: index("translations_created_at_idx").on(table.createdAt),
		upvotesIdx: index("translations_upvotes_idx").on(table.upvotesCount),
	}),
);

// Practices table
export const practices = pgTable(
	"practices",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		userInput: text("user_input").notNull(),
		inputMethod: inputMethodEnum("input_method").notNull(),
		audioFileId: text("audio_file_id").references(() => audioFiles.id, {
			onDelete: "set null",
		}),
		feedbackText: text("feedback_text").notNull(),
		score: integer("score").notNull(),
		suggestions: jsonb("suggestions"),
		challengePrompt: text("challenge_prompt"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		userIdIdx: index("practices_user_id_idx").on(table.userId),
		createdAtIdx: index("practices_created_at_idx").on(table.createdAt),
	}),
);

// Saved examples table
export const savedExamples = pgTable(
	"saved_examples",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		translationId: text("translation_id")
			.notNull()
			.references(() => translations.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		uniqueUserTranslation: uniqueIndex(
			"saved_examples_user_translation_idx",
		).on(table.userId, table.translationId),
	}),
);

// Audience Types table (admin-managed, dynamic)
export const audienceTypes = pgTable(
	"audience_types",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		key: text("key").notNull().unique(),
		label: text("label").notNull(),
		description: text("description"),
		promptTemplate: text("prompt_template").notNull(),
		isActive: boolean("is_active").notNull().default(true),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		keyIdx: uniqueIndex("audience_types_key_idx").on(table.key),
		isActiveIdx: index("audience_types_is_active_idx").on(table.isActive),
		sortOrderIdx: index("audience_types_sort_order_idx").on(table.sortOrder),
	}),
);

// AI Models table (admin-managed, dynamic)
export const aiModels = pgTable(
	"ai_models",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		key: text("key").notNull().unique(),
		label: text("label").notNull(),
		description: text("description"),
		provider: text("provider").notNull().default("google"),
		isActive: boolean("is_active").notNull().default(true),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		keyIdx: uniqueIndex("ai_models_key_idx").on(table.key),
		isActiveIdx: index("ai_models_is_active_idx").on(table.isActive),
		sortOrderIdx: index("ai_models_sort_order_idx").on(table.sortOrder),
	}),
);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type AudioFile = typeof audioFiles.$inferSelect;
export type Translation = typeof translations.$inferSelect;
export type Practice = typeof practices.$inferSelect;
export type SavedExample = typeof savedExamples.$inferSelect;
export type AudienceType = typeof audienceTypes.$inferSelect;
export type NewAudienceType = typeof audienceTypes.$inferInsert;
export type AiModel = typeof aiModels.$inferSelect;
export type NewAiModel = typeof aiModels.$inferInsert;

// Translation votes table (upvote/downvote)
export const translationVotes = pgTable(
	"translation_votes",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		translationId: text("translation_id")
			.notNull()
			.references(() => translations.id, { onDelete: "cascade" }),
		voteType: text("vote_type", { enum: ["up", "down"] }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		uniqueUserTranslation: uniqueIndex(
			"translation_votes_user_translation_idx",
		).on(table.userId, table.translationId),
		translationIdx: index("translation_votes_translation_idx").on(
			table.translationId,
		),
	}),
);

export type TranslationVote = typeof translationVotes.$inferSelect;

// Practice challenges table
export const challenges = pgTable(
	"challenges",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => createId()),
		title: text("title").notNull(),
		description: text("description").notNull(),
		difficulty: text("difficulty", {
			enum: ["beginner", "intermediate", "expert"],
		}).notNull(),
		xpReward: integer("xp_reward").notNull().default(50),
		tags: jsonb("tags").$type<string[]>(),
		hints: jsonb("hints").$type<string[]>(),
		isActive: boolean("is_active").notNull().default(true),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		difficultyIdx: index("challenges_difficulty_idx").on(table.difficulty),
		activeIdx: index("challenges_active_idx").on(table.isActive),
	}),
);

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
