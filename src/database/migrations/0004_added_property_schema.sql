CREATE TYPE "public"."item_category" AS ENUM('HOTEL', 'APARTMENT', 'HOUSE', 'ROOM');--> statement-breakpoint
CREATE TABLE "items" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "item_category" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp (3)
);
--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "property_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_property_id_items_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;