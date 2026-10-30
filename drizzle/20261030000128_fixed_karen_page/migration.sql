CREATE TABLE "product_colors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_slug" text NOT NULL,
	"name" text,
	"hex" text,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	CONSTRAINT "product_colors_unique" UNIQUE NULLS NOT DISTINCT("product_slug","hex")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"size_id" uuid NOT NULL,
	"color_id" uuid,
	"sku" text UNIQUE,
	CONSTRAINT "product_variants_unique" UNIQUE NULLS NOT DISTINCT("size_id","color_id")
);
--> statement-breakpoint
DROP TABLE "size_colors";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "product_colors_product_idx" ON "product_colors" ("product_slug");--> statement-breakpoint
CREATE INDEX "product_variants_size_idx" ON "product_variants" ("size_id");--> statement-breakpoint
CREATE INDEX "product_variants_color_idx" ON "product_variants" ("color_id");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" ("category_slug");--> statement-breakpoint
CREATE INDEX "products_sub_category_idx" ON "products" ("sub_category_slug");--> statement-breakpoint
ALTER TABLE "product_colors" ADD CONSTRAINT "product_colors_product_slug_products_slug_fkey" FOREIGN KEY ("product_slug") REFERENCES "products"("slug") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_size_id_product_sizes_id_fkey" FOREIGN KEY ("size_id") REFERENCES "product_sizes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_color_id_product_colors_id_fkey" FOREIGN KEY ("color_id") REFERENCES "product_colors"("id") ON DELETE CASCADE;