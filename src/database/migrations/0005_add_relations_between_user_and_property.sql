ALTER TABLE "items" ALTER COLUMN "category" SET DATA TYPE "public"."reservation_status" USING "category"::text::"public"."reservation_status";--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."item_category";