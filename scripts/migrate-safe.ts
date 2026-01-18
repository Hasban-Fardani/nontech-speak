import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log("🚀 Creating translation_votes table...");

  try {
    // Create translation_votes table
    await sql`
			CREATE TABLE IF NOT EXISTS "translation_votes" (
				"id" text PRIMARY KEY NOT NULL,
				"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
				"translation_id" text NOT NULL REFERENCES "translations"("id") ON DELETE CASCADE,
				"vote_type" text NOT NULL CHECK ("vote_type" IN ('up', 'down')),
				"created_at" timestamp DEFAULT now() NOT NULL
			)
		`;

    // Create unique index
    await sql`
			CREATE UNIQUE INDEX IF NOT EXISTS "translation_votes_user_translation_idx" 
			ON "translation_votes" ("user_id", "translation_id")
		`;

    // Create translation index
    await sql`
			CREATE INDEX IF NOT EXISTS "translation_votes_translation_idx" 
			ON "translation_votes" ("translation_id")
		`;

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
