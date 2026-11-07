CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"roblox_user_id" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"account_age_days" integer,
	"region" text,
	"policy_flags" jsonb,
	"first_seen" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_roblox_user_id_unique" UNIQUE("roblox_user_id")
);
