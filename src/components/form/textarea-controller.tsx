import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  title?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const TextareaController = <T extends FieldValues>({
  name,
  control,
  title,
  placeholder,
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
          <Textarea
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            className={cn("", className)}
            disabled={disabled}
            value={field.value ?? ""}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
