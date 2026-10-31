CREATE TABLE "images" (
	"id" serial PRIMARY KEY,
	"url" text NOT NULL UNIQUE,
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "images_created_idx" ON "images" ("created_at");--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_category_slug_categories_slug_fkey", ADD CONSTRAINT "products_category_slug_categories_slug_fkey" FOREIGN KEY ("category_slug") REFERENCES "categories"("slug") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_sub_category_slug_sub_categories_slug_fkey", ADD CONSTRAINT "products_sub_category_slug_sub_categories_slug_fkey" FOREIGN KEY ("sub_category_slug") REFERENCES "sub_categories"("slug") ON DELETE SET NULL ON UPDATE CASCADE;