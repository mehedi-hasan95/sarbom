import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { cn } from "cn";

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const SwitchController = <T extends FieldValues>({
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

          <Switch
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            checked={field.value}
            onCheckedChange={field.onChange}
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
