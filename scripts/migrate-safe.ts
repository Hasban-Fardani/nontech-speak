import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log("🚀 Adding geminiApiKey to users table...");

  try {
    // Add geminiApiKey column to users table
    await sql`
			ALTER TABLE "users" 
			ADD COLUMN IF NOT EXISTS "gemini_api_key" text
		`;

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
