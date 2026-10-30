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
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_cat_slug_key";--> statement-breakpoint
CREATE INDEX "category_slug_idx" ON "categories" ("slug");--> statement-breakpoint
CREATE INDEX "product_sizes_product_idx" ON "product_sizes" ("product_slug");--> statement-breakpoint
CREATE INDEX "size_colors_size_idx" ON "size_colors" ("size_id");--> statement-breakpoint
CREATE INDEX "sub_categories_slug_idx" ON "sub_categories" ("cat_slug");--> statement-breakpoint
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_slug_products_id_fkey" FOREIGN KEY ("product_slug") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "size_colors" ADD CONSTRAINT "size_colors_size_id_product_sizes_id_fkey" FOREIGN KEY ("size_id") REFERENCES "product_sizes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_cat_slug_categories_slug_fkey", ADD CONSTRAINT "sub_categories_cat_slug_categories_slug_fkey" FOREIGN KEY ("cat_slug") REFERENCES "categories"("slug") ON DELETE SET NULL ON UPDATE CASCADE;