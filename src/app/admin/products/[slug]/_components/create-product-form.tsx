"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "@/zod-validator/product-validator"; // adjust to where you put the validator
import { DetailsCard } from "./details-card";
import { SpecificationCard } from "./specification-card";
import { ColorsCard } from "./colors-card";
import { SizesCard } from "./sizes-card";

/* -------------------------------------------------------------------------- */
/*  Types & helpers                                                           */
/* -------------------------------------------------------------------------- */

type Option = { slug: string; name: string };
type SubCategoryOption = Option & { categorySlug: string };

type CreateProductFormProps = {
  categories: Option[];
  subCategories: SubCategoryOption[];
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  defaultValues?: Partial<ProductFormInput>;
};

export const emptyVariant = (colorKey: string | null = null) => ({
  colorKey,
  sku: "",
});

/** array-level errors (e.g. "Add at least one size") live on `.root` or `.message` */
export function ArrayError({ error }: { error: unknown }) {
  const e = error as
    | { root?: { message?: string }; message?: string }
    | undefined;
  const message = e?.root?.message ?? e?.message;
  if (!message) return null;
  return <FieldError errors={[{ message }]} />;
}

/* -------------------------------------------------------------------------- */
/*  Main form                                                                 */
/* -------------------------------------------------------------------------- */

export function CreateProductForm({
  categories,
  subCategories,
  onSubmit,
  defaultValues,
}: CreateProductFormProps) {
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      slug: "",
      shortDesc: "",
      description: "",
      categorySlug: "",
      subCategorySlug: "",
      status: "inactive",
      specification: [],
      colors: [],
      sizes: [
        { size: "", price: "", compareAtPrice: "", variants: [emptyVariant()] },
      ],
      ...defaultValues,
    },
  });

  const { isSubmitting, isSubmitted, isValid } = form.formState;

  return (
    <FormProvider {...form}>
      <form
        id="form-create-product"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="space-y-6">
          <DetailsCard />
          <SpecificationCard />
          <ColorsCard />
          <SizesCard />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <OrganizationCard
            categories={categories}
            subCategories={subCategories}
          />
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => form.reset()}
            >
              Discard
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
              Create product
            </Button>
          </Field>
          {isSubmitted && !isValid && (
            <FieldError
              errors={[
                {
                  message:
                    "Some fields need attention. Check the highlighted fields.",
                },
              ]}
            />
          )}
        </aside>
      </form>
    </FormProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status and categories                                                     */
/* -------------------------------------------------------------------------- */

function OrganizationCard({
  categories,
  subCategories,
}: {
  categories: Option[];
  subCategories: SubCategoryOption[];
}) {
  const { control, setValue } = useFormContext<ProductFormInput>();
  const categorySlug = useWatch({ control, name: "categorySlug" });
  const visibleSubCategories = subCategories.filter(
    (s) => s.categorySlug === categorySlug,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-status">Status</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="product-status"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Only active products show in the store.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="categorySlug"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("subCategorySlug", "");
                  }}
                >
                  <SelectTrigger
                    id="product-category"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="subCategorySlug"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-sub-category">
                  Sub category
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!categorySlug}
                >
                  <SelectTrigger
                    id="product-sub-category"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue
                      placeholder={
                        categorySlug
                          ? "Select a sub category"
                          : "Select a category first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {visibleSubCategories.map((s) => (
                      <SelectItem key={s.slug} value={s.slug}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
