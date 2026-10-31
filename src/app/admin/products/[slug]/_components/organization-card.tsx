"use client";

import { FieldGroup } from "@/components/ui/field";
import { ModifyCard } from "./modify-card";
import { useFormContext, useWatch } from "react-hook-form";
import { ProductFormInput } from "@/zod-validator/product-validator";
import { ComboboxController } from "@/components/form/combobox-controller";
import {
  useGetCategories,
  useGetSubCategories,
} from "@/hooks/categories/use-categories";
import { useQuery } from "@tanstack/react-query";
import { getSubCategoriesOptions } from "@/transtack-options/category-data";

export const OrganizationCard = () => {
  const { control, setValue } = useFormContext<ProductFormInput>();
  const categorySlug = useWatch({ control, name: "categorySlug" });
  const { data: categories } = useGetCategories();
  const { data: subCategories } = useQuery(
    getSubCategoriesOptions(categorySlug),
  );
  return (
    <ModifyCard title="Organization">
      <FieldGroup>
        <ComboboxController
          control={control}
          name="status"
          options={[
            { label: "Inactive", value: "inactive" },
            { label: "Active", value: "active" },
          ]}
          title="Status"
          placeholder="Select Status"
        />

        <ComboboxController
          control={control}
          name="categorySlug"
          options={categories.map((item) => ({
            label: item.name,
            value: item.slug,
          }))}
          title="Category"
          placeholder="Select Category"
        />

        <ComboboxController
          control={control}
          name="subCategorySlug"
          options={
            subCategories?.data.map((item) => ({
              label: item.name,
              value: item.slug,
            })) ?? []
          }
          title="Category"
          placeholder="Select Category"
          disabled={!categorySlug}
        />
      </FieldGroup>
    </ModifyCard>
  );
};
