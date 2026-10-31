"use client";

import { ProductFormInput } from "@/zod-validator/product-validator";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ModifyCard } from "./modify-card";
import { FieldGroup } from "@/components/ui/field";
import { ArrayError } from "./create-product-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SizeCard } from "./size-card";

const emptyVariant = (colorKey: string | null = null) => ({
  colorKey,
  sku: "",
});
export const SizesCard = () => {
  const { control, getValues, formState } = useFormContext<ProductFormInput>();
  const sizes = useFieldArray({ control, name: "sizes" });

  function addSize() {
    const colors = getValues("colors");
    sizes.append({
      size: "",
      price: "",
      compareAtPrice: "",
      variants: colors.length
        ? colors.map((c) => emptyVariant(c.key))
        : [emptyVariant()],
    });
  }
  return (
    <ModifyCard
      title="Sizes, pricing and stock"
      description="Price is set per size. Each variant is one size and color you can
          sell, with its own SKU and stock."
    >
      <FieldGroup>
        {sizes.fields.map((size, i) => (
          <SizeCard
            key={size.id}
            index={i}
            canRemove={sizes.fields.length > 1}
            onRemove={() => sizes.remove(i)}
          />
        ))}

        <ArrayError error={formState.errors.sizes} />

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addSize}>
            <Plus aria-hidden /> Add size
          </Button>
        </div>
      </FieldGroup>
    </ModifyCard>
  );
};
