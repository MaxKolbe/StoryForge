ALTER TABLE "stories" ADD COLUMN "stripe_checkout_session_id" text;--> statement-breakpoint
CREATE INDEX "stripe_checkout_index" ON "stories" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id");