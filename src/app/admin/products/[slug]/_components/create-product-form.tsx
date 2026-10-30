"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

/* -------------------------------------------------------------------------- */
/*  Types & helpers                                                           */
/* -------------------------------------------------------------------------- */

type Option = { slug: string; name: string };
type SubCategoryOption = Option & { categorySlug: string };

type CreateProductFormProps = {
  categories: Option[];
  subCategories: SubCategoryOption[];
  /** uploads one file and resolves with its public URL */
  uploadImage: (file: File) => Promise<string>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  defaultValues?: Partial<ProductFormInput>;
};

const MAX_IMAGES = 8;

const emptyVariant = (colorKey: string | null = null) => ({
  colorKey,
  sku: "",
  stock: 0,
});

/** array-level errors (e.g. "Add at least one size") live on `.root` or `.message` */
function ArrayError({ error }: { error: unknown }) {
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
  uploadImage,
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
          <ColorsCard uploadImage={uploadImage} />
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
/*  Colors                                                                    */
/* -------------------------------------------------------------------------- */

function ColorsCard({
  uploadImage,
}: {
  uploadImage: (file: File) => Promise<string>;
}) {
  const { control, getValues, setValue, formState } =
    useFormContext<ProductFormInput>();
  const colors = useFieldArray({ control, name: "colors" });

  function addColor() {
    const hadColors = colors.fields.length > 0;
    const key = crypto.randomUUID();
    colors.append({ key, name: "", hex: "#000000", images: [] });

    // keep every size's variants in step with the colors list
    getValues("sizes").forEach((size, si) => {
      if (!hadColors) {
        // the placeholder "no color" variant becomes the first color's variant
        const only = size.variants[0];
        if (size.variants.length === 1 && only && only.colorKey === null) {
          setValue(`sizes.${si}.variants.0.colorKey`, key);
        }
      } else {
        setValue(`sizes.${si}.variants`, [...size.variants, emptyVariant(key)]);
      }
    });
  }

  function removeColor(index: number) {
    const removed = colors.fields[index];
    if (!removed) return;
    const remaining = colors.fields.length - 1;
    colors.remove(index);

    getValues("sizes").forEach((size, si) => {
      let next = size.variants.filter((v) => v.colorKey !== removed.key);
      if (next.length === 0 && remaining === 0) next = [emptyVariant()];
      setValue(`sizes.${si}.variants`, next);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Colors and images</CardTitle>
        <CardDescription>
          Images belong to a color and are shared by every size. Skip this if
          the product comes in one color.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {colors.fields.map((color, i) => (
            <div key={color.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Controller
                    name={`colors.${i}.name`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`color-${i}-name`}>
                          Color name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`color-${i}-name`}
                          aria-invalid={fieldState.invalid}
                          placeholder="Midnight blue"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`colors.${i}.hex`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`color-${i}-hex`}>Hex</FieldLabel>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            aria-label="Pick a color"
                            value={
                              /^#[0-9a-f]{6}$/i.test(field.value)
                                ? field.value
                                : "#000000"
                            }
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-9 w-12 shrink-0 cursor-pointer rounded-md border bg-transparent p-1"
                          />
                          <Input
                            {...field}
                            id={`color-${i}-hex`}
                            aria-invalid={fieldState.invalid}
                            placeholder="#191970"
                            className="font-mono"
                            autoComplete="off"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  aria-label={`Remove color ${i + 1}`}
                  onClick={() => removeColor(i)}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>

              <ColorImages index={i} uploadImage={uploadImage} />
            </div>
          ))}

          <ArrayError error={formState.errors.colors} />

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addColor}
            >
              <Plus aria-hidden /> Add color
            </Button>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

function ColorImages({
  index,
  uploadImage,
}: {
  index: number;
  uploadImage: (file: File) => Promise<string>;
}) {
  const { control } = useFormContext<ProductFormInput>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  return (
    <Controller
      name={`colors.${index}.images`}
      control={control}
      render={({ field, fieldState }) => {
        async function handleFiles(files: FileList | null) {
          if (!files?.length) return;
          setUploading(true);
          try {
            const room = MAX_IMAGES - field.value.length;
            const urls = await Promise.all(
              Array.from(files).slice(0, room).map(uploadImage),
            );
            field.onChange([...field.value, ...urls]);
          } catch {
            toast.error("Upload failed. Check your connection and try again.");
          } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
          }
        }

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`color-${index}-images`}>Images</FieldLabel>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {field.value.map((url, i) => (
                <div
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="size-full object-cover" />
                  {i === 0 && (
                    <Badge className="absolute bottom-1 left-1">Main</Badge>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label="Remove image"
                    className="absolute top-1 right-1 size-6 opacity-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    onClick={() =>
                      field.onChange(field.value.filter((_, j) => j !== i))
                    }
                  >
                    <X aria-hidden />
                  </Button>
                </div>
              ))}

              {field.value.length < MAX_IMAGES && (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden />
                  ) : (
                    <ImagePlus className="size-5" aria-hidden />
                  )}
                  {uploading ? "Uploading" : "Add images"}
                </button>
              )}
            </div>

            <input
              ref={inputRef}
              id={`color-${index}-images`}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <FieldDescription>
              Up to {MAX_IMAGES} images. The first one is the main image.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Sizes and variants                                                        */
/* -------------------------------------------------------------------------- */

function SizesCard() {
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
    <Card>
      <CardHeader>
        <CardTitle>Sizes, pricing and stock</CardTitle>
        <CardDescription>
          Price is set per size. Each variant is one size and color you can
          sell, with its own SKU and stock.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

function SizeCard({
  index,
  canRemove,
  onRemove,
}: {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const { control, formState } = useFormContext<ProductFormInput>();
  const colors = useWatch({ control, name: "colors" });
  const used = useWatch({ control, name: `sizes.${index}.variants` });
  const variants = useFieldArray({ control, name: `sizes.${index}.variants` });

  const hasColors = colors.length > 0;
  const missingColors = colors.filter(
    (c) => !used.some((v) => v.colorKey === c.key),
  );

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <div className="grid flex-1 gap-3 sm:grid-cols-3">
          <Controller
            name={`sizes.${index}.size`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`size-${index}-size`}>Size</FieldLabel>
                <Input
                  {...field}
                  id={`size-${index}-size`}
                  aria-invalid={fieldState.invalid}
                  placeholder="M"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name={`sizes.${index}.price`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`size-${index}-price`}>Price</FieldLabel>
                <Input
                  {...field}
                  id={`size-${index}-price`}
                  aria-invalid={fieldState.invalid}
                  inputMode="decimal"
                  placeholder="20.00"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name={`sizes.${index}.compareAtPrice`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`size-${index}-compare`}>
                  Compare-at price
                </FieldLabel>
                <Input
                  {...field}
                  id={`size-${index}-compare`}
                  aria-invalid={fieldState.invalid}
                  inputMode="decimal"
                  placeholder="25.00"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-6"
            aria-label={`Remove size ${index + 1}`}
            onClick={onRemove}
          >
            <Trash2 aria-hidden />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {variants.fields.map((variant, j) => (
          <div
            key={variant.id}
            className={
              hasColors
                ? "grid items-start gap-3 sm:grid-cols-[1.2fr_1fr_6.5rem_auto]"
                : "grid items-start gap-3 sm:grid-cols-[1fr_6.5rem_auto]"
            }
          >
            {hasColors && (
              <Controller
                name={`sizes.${index}.variants.${j}.colorKey`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={`variant-${index}-${j}-color`}
                      className={j > 0 ? "sm:sr-only" : undefined}
                    >
                      Color
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={`variant-${index}-${j}-color`}
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((c) => (
                          <SelectItem
                            key={c.key}
                            value={c.key}
                            disabled={used.some(
                              (u, k) => k !== j && u.colorKey === c.key,
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                aria-hidden
                                className="size-3 rounded-full border"
                                style={{ backgroundColor: c.hex }}
                              />
                              {c.name || c.hex || "Unnamed color"}
                            </span>
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
            )}

            <Controller
              name={`sizes.${index}.variants.${j}.sku`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={`variant-${index}-${j}-sku`}
                    className={j > 0 ? "sm:sr-only" : undefined}
                  >
                    SKU
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`variant-${index}-${j}-sku`}
                    aria-invalid={fieldState.invalid}
                    placeholder="TEE-M-BLU"
                    className="font-mono"
                    autoComplete="off"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* <Controller
              name={`sizes.${index}.variants.${j}.stock`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={`variant-${index}-${j}-stock`}
                    className={j > 0 ? "sm:sr-only" : undefined}
                  >
                    Stock
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`variant-${index}-${j}-stock`}
                    aria-invalid={fieldState.invalid}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> */}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={j === 0 ? "sm:mt-6" : undefined}
              aria-label="Remove variant"
              disabled={variants.fields.length === 1}
              onClick={() => variants.remove(j)}
            >
              <X aria-hidden />
            </Button>
          </div>
        ))}

        <ArrayError error={formState.errors.sizes?.[index]?.variants} />

        {hasColors && missingColors.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              missingColors.forEach((c) => variants.append(emptyVariant(c.key)))
            }
          >
            <Plus aria-hidden />
            {missingColors.length === 1
              ? "Add missing color"
              : `Add ${missingColors.length} missing colors`}
          </Button>
        )}
      </div>
    </div>
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
