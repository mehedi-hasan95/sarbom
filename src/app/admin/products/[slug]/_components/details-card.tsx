"use client";

import { FieldGroup } from "@/components/ui/field";

import { ProductFormInput } from "@/zod-validator/product-validator";
import { useFormContext } from "react-hook-form";
import { ModifyCard } from "./modify-card";
import { InputController } from "@/components/form/input-controller";
import { TextareaController } from "@/components/form/textarea-controller";
import { slugify } from "@/lib/utils";

export const DetailsCard = () => {
  const { control, setValue, formState } = useFormContext<ProductFormInput>();
  return (
    <ModifyCard
      title="Product details"
      description="What customers see on the product page."
    >
      <FieldGroup>
        <InputController
          control={control}
          name="name"
          title="Name"
          placeholder="Classic tee"
          onChange={(value) => {
            if (!formState.dirtyFields.slug) {
              setValue("slug", slugify(value), {
                shouldValidate: formState.isSubmitted,
              });
            }
          }}
        />

        <InputController
          control={control}
          name="slug"
          title="Slug"
          placeholder="classic-tee"
        />

        <TextareaController
          control={control}
          name="shortDesc"
          placeholder="A soft, midnight cotton tee that holds its shape."
          title="Short Description"
          maxNumber={200}
        />

        <TextareaController control={control} name="description" />
      </FieldGroup>
    </ModifyCard>
  );
};
