"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { InputController } from "@/components/form/input-controller";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "@/action/categories-action";
import { toast } from "sonner";
import { category_cache, single_category_cache } from "@/constants/query-cache";
import { LoadingButton } from "@/components/common/loading-button";
import { getSingleCategoryOptions } from "@/transtack-options/category-data";
import { slugify } from "@/lib/utils";
import { categoryValidator } from "@/zod-validator/validators";

export const CreateCategoryForm = () => {
  const close = useModalStore((state) => state.close);
  const data = useModalStore((state) => state.data);

  const { data: singleCat } = useQuery({
    ...getSingleCategoryOptions(data ?? ""),
    enabled: data !== null,
  });

  const form = useForm<z.infer<typeof categoryValidator>>({
    resolver: zodResolver(categoryValidator),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (singleCat?.data) {
      form.reset({
        name: singleCat.data.name ?? "",
        slug: singleCat.data.slug ?? "",
      });
    }
  }, [singleCat, form]);

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
      close();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // update mutation

  const { mutate: updateMutate, isPending: isPendingUpdate } = useMutation({
    mutationFn: updateCategory,
    onSuccess: (result, variables) => {
      if (result.error) {
        toast.error(String(result.error));
        return;
      }

      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: category_cache });
      queryClient.invalidateQueries({
        queryKey: single_category_cache(variables.slug),
      });
      close();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  function onSubmit(data: z.infer<typeof categoryValidator>) {
    if (singleCat?.data) {
      updateMutate({ ...data, id: singleCat.data?.id });
    } else {
      mutate(data);
    }
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
          {isPending || isPendingUpdate ? (
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
