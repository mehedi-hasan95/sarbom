"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { InputController } from "@/components/form/input-controller";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  single_sub_category_cache,
  sub_category_cache,
} from "@/constants/query-cache";
import { LoadingButton } from "@/components/common/loading-button";
import { slugify } from "@/lib/utils";
import {
  useGetCategories,
  useGetSingleSubCategories,
} from "@/hooks/categories/use-categories";
import { subCategoriesValidator } from "@/zod-validator/validators";
import {
  createSubCategory,
  updateSubCategory,
} from "@/action/sub-categories-action";
import { ComboboxController } from "@/components/form/combobox-controller";

export const CreateSubCategoryForm = () => {
  const close = useModalStore((state) => state.close);
  const data = useModalStore((state) => state.data);

  const { data: categories } = useGetCategories();
  const { data: singleSubCat } = useGetSingleSubCategories(data ?? "");

  const form = useForm<z.infer<typeof subCategoriesValidator>>({
    resolver: zodResolver(subCategoriesValidator),
    defaultValues: {
      name: "",
      slug: "",
      catSlug: "",
    },
  });

  useEffect(() => {
    if (singleSubCat) {
      form.reset({
        name: singleSubCat.name ?? "",
        slug: singleSubCat.slug ?? "",
        catSlug: singleSubCat.catSlug,
      });
    }
  }, [singleSubCat, form]);

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
    mutationFn: createSubCategory,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(String(result.error));
        return;
      }

      toast.success("Sub Category created successfully");
      queryClient.invalidateQueries({ queryKey: sub_category_cache });
      close();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // update mutation

  const { mutate: updateMutate, isPending: isPendingUpdate } = useMutation({
    mutationFn: updateSubCategory,
    onSuccess: (result, variables) => {
      if (result.error) {
        toast.error(String(result.error));
        return;
      }

      toast.success("Sub Category created successfully");
      queryClient.invalidateQueries({ queryKey: sub_category_cache });
      queryClient.invalidateQueries({
        queryKey: single_sub_category_cache(variables.slug),
      });
      close();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  function onSubmit(data: z.infer<typeof subCategoriesValidator>) {
    if (singleSubCat) {
      updateMutate({ ...data, id: singleSubCat.id });
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
          <ComboboxController
            control={form.control}
            name="catSlug"
            options={categories.map((item) => ({
              label: item.name,
              value: item.slug,
            }))}
          />
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
