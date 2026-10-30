"use client";

import { ComboboxController } from "@/components/form/combobox-controller";
import { InputController } from "@/components/form/input-controller";
import { TextareaController } from "@/components/form/textarea-controller";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { slugify } from "@/lib/utils";
import { productsValidator } from "@/zod-validator/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import z from "zod";

export const CreateProduct = () => {
  const form = useForm<z.input<typeof productsValidator>>({
    resolver: zodResolver(productsValidator),
    defaultValues: {
      name: "",
      slug: "",
      shortDesc: "",
      description: "",
      categorySlug: "",
      specification: [{ key: "", value: "" }],
    },
  });

  //   for slug
  const name = useWatch({
    control: form.control,
    name: "name",
  });
  const isSlugEdited = !!form.formState.dirtyFields.slug;
  useEffect(() => {
    if (!isSlugEdited) {
      form.setValue("slug", slugify(name), {
        shouldValidate: form.formState.isSubmitted,
      });
    }
  }, [name, isSlugEdited, form]);

  //   for append specification
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specification",
  });
  const sp = useWatch({ control: form.control, name: "specification" });
  const hasEmptyRow = (sp ?? []).some(
    (item) => !item?.key?.trim() || !item?.value?.trim(),
  );

  function onSubmit(data: z.input<typeof productsValidator>) {
    const filteredData = {
      ...data,
      specification: data?.specification?.filter(
        (item) => item.key.trim() !== "" && item.value.trim() !== "",
      ),
    };

    console.log(filteredData);
  }
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-rhf-demo"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <InputController
              control={form.control}
              name="name"
              title="Product Name"
              placeholder="Something..."
            />
            <InputController
              control={form.control}
              name="slug"
              title="Slug"
              placeholder="something"
            />
            <ComboboxController
              control={form.control}
              name="categorySlug"
              title="Select Category"
              options={[{ label: "New", value: "new" }]}
            />
            <TextareaController
              control={form.control}
              name="shortDesc"
              title="Short Description"
              placeholder="Something..."
            />
            <TextareaController
              control={form.control}
              name="description"
              title="Description"
            />
          </FieldGroup>

          <FieldGroup>
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Specification {index + 1}
                  </h3>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputController
                    control={form.control}
                    name={`specification.${index}.key`}
                    title="Specification Name"
                    placeholder="e.g. Color"
                  />

                  <InputController
                    control={form.control}
                    name={`specification.${index}.value`}
                    title="Specification Value"
                    placeholder="e.g. Black"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ key: "", value: "" })}
              disabled={hasEmptyRow}
            >
              + Add Specification
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
