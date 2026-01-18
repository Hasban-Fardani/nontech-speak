import { neon } from "@neondatabase/serverless";

// biome-ignore lint/style/noNonNullAssertion: guaranteed by environment
const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
	console.log("🚀 Creating challenges table and updating users...");

	try {
		// Add totalXp to users table
		await sql`
			ALTER TABLE "users" 
			ADD COLUMN IF NOT EXISTS "total_xp" integer DEFAULT 0 NOT NULL
		`;

		// Create challenges table
		await sql`
			CREATE TABLE IF NOT EXISTS "challenges" (
				"id" text PRIMARY KEY NOT NULL,
				"title" text NOT NULL,
				"description" text NOT NULL,
				"difficulty" text NOT NULL CHECK ("difficulty" IN ('beginner', 'intermediate', 'expert')),
				"xp_reward" integer DEFAULT 50 NOT NULL,
				"tags" jsonb,
				"hints" jsonb,
				"is_active" boolean DEFAULT true NOT NULL,
				"created_at" timestamp DEFAULT now() NOT NULL
			)
		`;

		// Create indexes
		await sql`
			CREATE INDEX IF NOT EXISTS "challenges_difficulty_idx" 
			ON "challenges" ("difficulty")
		`;

		await sql`
			CREATE INDEX IF NOT EXISTS "challenges_active_idx" 
			ON "challenges" ("is_active")
		`;

		// Seed initial challenges
		await sql`
			INSERT INTO "challenges" (id, title, description, difficulty, xp_reward, tags, hints)
			VALUES 
				('c1', 'Explain API to a Grandparent', 'Goal: Explain how software talks to software without using jargon. Use an everyday analogy.', 'beginner', 50, '["System Design", "Web"]', '["Think about a restaurant scenario", "You (the customer) don''t go into the kitchen (the server)", "Someone takes your order and brings the food back"]'),
				('c2', 'Explain Cloud Computing', 'Goal: Describe on-demand computing resources using a real-world analogy.', 'beginner', 50, '["Infrastructure", "Cloud"]', '["Think about electricity or water utilities", "You don''t own the power plant", "You pay for what you use"]'),
				('c3', 'Explain Encryption', 'Goal: Illustrate how data is protected from unauthorized access.', 'intermediate', 100, '["Security", "Cryptography"]', '["Think about a locked box", "Only the person with the key can open it", "Even if someone steals the box, they can''t see inside"]'),
				('c4', 'Explain Blockchain', 'Goal: Define a decentralized ledger system simply.', 'expert', 150, '["Web3", "Database"]', '["Think about a shared notebook", "Everyone has a copy", "No one can change old pages without everyone noticing"]')
			ON CONFLICT (id) DO NOTHING
		`;

		console.log("✅ Migration completed successfully!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Migration failed:", error);
		process.exit(1);
	}
}

runMigration();
