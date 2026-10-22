import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "cn";
import type { Matcher } from "react-day-picker";

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  title?: string;
  placeholder?: string;
  className?: string;
  disabled?: Matcher | Matcher[];
}

export const DateController = <T extends FieldValues>({
  name,
  control,
  title,
  className,
  disabled,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center">
            <FieldLabel htmlFor={name}>{title}</FieldLabel>
          </div>

          <Calendar
            {...field}
            id={name}
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            className={cn("", className)}
            disabled={disabled}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
