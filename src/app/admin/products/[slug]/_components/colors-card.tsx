"use client";

import { ProductFormInput } from "@/zod-validator/product-validator";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { ModifyCard } from "./modify-card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputController } from "@/components/form/input-controller";
import { Input } from "@/components/ui/input";
import { ColorImages } from "./color-images";

export const ColorsCard = () => {
  const { control, getValues, setValue } = useFormContext<ProductFormInput>();
  const colors = useFieldArray({ control, name: "colors" });

  const emptyVariant = (colorKey: string | null = null) => ({
    colorKey,
    sku: "",
  });

  function addColor() {
    const hadColors = colors.fields.length > 0;
    const key = crypto.randomUUID();
    colors.append({ key, name: "", hex: "", images: [] });

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
    <ModifyCard
      title="Colors and images"
      description="Images belong to a color and are shared by every size. Skip this if
          the product comes in one color."
    >
      <FieldGroup>
        {colors.fields.map((color, i) => (
          <div key={color.id} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <InputController
                  name={`colors.${i}.name`}
                  control={control}
                  title="Color Name (optional)"
                  placeholder="Midnight blue"
                />
                <Controller
                  name={`colors.${i}.hex`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`color-${i}-hex`}>
                        Hex (Optional)
                      </FieldLabel>

                      <div className="flex gap-2">
                        <input
                          type="color"
                          aria-label="Pick a color"
                          value={
                            /^#[0-9a-f]{6}$/i.test(field.value ?? "")
                              ? field.value!
                              : ""
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-9 w-12 shrink-0 cursor-pointer rounded-md border bg-transparent p-1"
                        />

                        <Input
                          {...field}
                          value={field.value ?? ""}
                          id={`color-${i}-hex`}
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. #191970"
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

            <ColorImages index={i} />
          </div>
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addColor}>
            <Plus aria-hidden /> Add color
          </Button>
        </div>
      </FieldGroup>
    </ModifyCard>
  );
};
