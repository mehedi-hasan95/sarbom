"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { categoryValidator } from "@/db/zod-validator/validators";
import { InputController } from "@/components/form/input-controller";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/store/useModalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/action/categories-action";
import { toast } from "sonner";
import { category_cache } from "@/constants/query-cache";
import { LoadingButton } from "@/components/common/loading-button";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const CreateCategoryForm = () => {
  const setOpen = useDialogStore((state) => state.setOpen);

  const form = useForm<z.infer<typeof categoryValidator>>({
    resolver: zodResolver(categoryValidator),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

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

  // create mutation
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(String(result.error));
        return;
      }

      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: category_cache });
      setOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  function onSubmit(data: z.infer<typeof categoryValidator>) {
    mutate(data);
  }

  return (
    <div>
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <InputController
            control={form.control}
            name="name"
            title="Category"
          />
          <InputController control={form.control} name="slug" title="Slug" />
        </FieldGroup>

        <div className="mt-5 flex gap-3">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          {isPending ? (
            <LoadingButton />
          ) : (
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
