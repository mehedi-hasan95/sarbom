import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { cn } from "cn";

type Option = { label: string; value: string };

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  title?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
}

export const ComboboxController = <T extends FieldValues>({
  name,
  control,
  title,
  placeholder = "Select an option",
  options,
  className,
  disabled,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected =
          options.find((option) => option.value === field.value) ?? null;

        return (
          <Field data-invalid={fieldState.invalid} className={cn(className)}>
            {title && (
              <div className="flex items-center">
                <FieldLabel htmlFor={name}>{title}</FieldLabel>
              </div>
            )}

            <Combobox
              items={options}
              value={selected}
              onValueChange={(item: Option | null) =>
                field.onChange(item?.value ?? "")
              }
              itemToStringLabel={(item: Option) => item.label}
              itemToStringValue={(item: Option) => item.value}
              disabled={disabled}
            >
              <ComboboxInput
                id={name}
                placeholder={placeholder}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
                disabled={disabled}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: Option) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
