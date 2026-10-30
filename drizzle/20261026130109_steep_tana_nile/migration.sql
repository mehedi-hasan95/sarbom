CREATE TYPE "product_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "product_sizes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_slug" text NOT NULL,
	"size" text,
	"price" numeric(12,2) NOT NULL,
	"compare_at_price" numeric(12,2),
	CONSTRAINT "product_sizes_unique" UNIQUE NULLS NOT DISTINCT("product_slug","size")
);
--> statement-breakpoint
CREATE TABLE "size_colors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"size_id" uuid NOT NULL,
	"name" text,
	"hex" text,
	"sku" text UNIQUE,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	CONSTRAINT "size_colors_unique" UNIQUE NULLS NOT DISTINCT("size_id","hex")
);
--> statement-breakpoint
DROP TABLE "product_variants";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "product_status" DEFAULT 'inactive'::"product_status";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_slug_key" UNIQUE("slug");--> statement-breakpoint
CREATE INDEX "product_sizes_product_idx" ON "product_sizes" ("product_slug");--> statement-breakpoint
CREATE INDEX "size_colors_size_idx" ON "size_colors" ("size_id");--> statement-breakpoint
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_slug_products_id_fkey" FOREIGN KEY ("product_slug") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "size_colors" ADD CONSTRAINT "size_colors_size_id_product_sizes_id_fkey" FOREIGN KEY ("size_id") REFERENCES "product_sizes"("id") ON DELETE CASCADE;