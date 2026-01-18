-- Migration: Add shareId to translations table safely
-- This migration handles existing data by:
-- 1. Adding shareId as nullable
-- 2. Populating shareId for existing records
-- 3. Making shareId NOT NULL and unique

-- Step 1: Add boss to audience_type enum
ALTER TYPE "public"."audience_type" ADD VALUE IF NOT EXISTS 'boss';

-- Step 2: Create ai_models table
CREATE TABLE IF NOT EXISTS "ai_models" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"provider" text DEFAULT 'google' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_models_key_unique" UNIQUE("key")
);

-- Step 3: Create audience_types table
CREATE TABLE IF NOT EXISTS "audience_types" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"prompt_template" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "audience_types_key_unique" UNIQUE("key")
);

-- Step 4: Add shareId column as nullable first
ALTER TABLE "translations" ADD COLUMN IF NOT EXISTS "share_id" text;

-- Step 5: Populate shareId for existing records using gen_random_uuid() or custom function
-- We'll use a simple approach with random strings
DO $$
DECLARE
    rec RECORD;
    new_share_id text;
BEGIN
    FOR rec IN SELECT id FROM translations WHERE share_id IS NULL LOOP
        -- Generate a unique ID similar to cuid2 format (simplified version)
        new_share_id := 'share_' || encode(gen_random_bytes(16), 'hex');
        UPDATE translations SET share_id = new_share_id WHERE id = rec.id;
    END LOOP;
END $$;

-- Step 6: Now make shareId NOT NULL and add unique constraint
ALTER TABLE "translations" ALTER COLUMN "share_id" SET NOT NULL;
ALTER TABLE "translations" ADD CONSTRAINT "translations_share_id_unique" UNIQUE("share_id");

-- Step 7: Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "ai_models_key_idx" ON "ai_models" USING btree ("key");
CREATE INDEX IF NOT EXISTS "ai_models_is_active_idx" ON "ai_models" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "ai_models_sort_order_idx" ON "ai_models" USING btree ("sort_order");

CREATE UNIQUE INDEX IF NOT EXISTS "audience_types_key_idx" ON "audience_types" USING btree ("key");
CREATE INDEX IF NOT EXISTS "audience_types_is_active_idx" ON "audience_types" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "audience_types_sort_order_idx" ON "audience_types" USING btree ("sort_order");

CREATE UNIQUE INDEX IF NOT EXISTS "translations_share_id_idx" ON "translations" USING btree ("share_id");
