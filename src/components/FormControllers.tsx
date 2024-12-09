import { cn } from "@/lib/utils";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type FormProviderProps,
} from "react-hook-form";
import {
  AutosizeTextarea,
  type AutosizeTextAreaProps,
} from "./ui/autosize-textarea";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "./ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form as FormLib,
  FormMessage,
} from "./ui/form";
import { Input, type InputProps } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DateTimePicker } from "./ui/datetime-picker";

type FormInputControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  input?: InputProps;
  label: string;
};

export const FormInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  input = {},
  label,
  ...props
}: FormInputControllerProps<TFieldValues, TName>) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...input} type={input.type ?? "text"} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type FormTextAreaControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  textarea?: AutosizeTextAreaProps;
  label: string;
};

export const FormTextAreaController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  textarea = {},
  label,
  ...props
}: FormTextAreaControllerProps<TFieldValues, TName>) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <AutosizeTextarea
              {...textarea}
              maxHeight={textarea.maxHeight ?? 80}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type FormSelectControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  placeholder: string;
  label: string;
  options: { label: string; value: string }[];
};

export const FormSelectController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  placeholder,
  label,
  options,
  ...props
}: FormSelectControllerProps<TFieldValues, TName>) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {/*eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Select
            onValueChange={field.onChange}
            defaultValue={
              field.value !== undefined ? String(field.value) : field.value
            }
          >
            <FormControl>
              <SelectTrigger className="font-medium">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type FormComboboxControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  placeholder: string;
  label: string;
  searchPlaceholder: string;
  emptyMessage: string;
  options: {
    label: string | React.ReactNode;
    value: string;
    disabled?: boolean;
  }[];
};

export const FormComboboxController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  options,
  ...props
}: FormComboboxControllerProps<TFieldValues, TName>) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {/*eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Combobox
            onValueChange={field.onChange}
            defaultValue={
              field.value !== undefined ? String(field.value) : field.value
            }
            options={options}
          >
            <FormControl>
              <ComboboxTrigger>
                <ComboboxValue placeholder={placeholder} />
              </ComboboxTrigger>
            </FormControl>
            <ComboboxContent
              emptyMessage={emptyMessage}
              searchPlaceholder={searchPlaceholder}
            >
              {options.map(({ label, value, disabled }) => (
                <ComboboxItem key={value} value={value} disabled={disabled}>
                  {label}
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type FormDateTimeControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label: string;
  picker?: Omit<
    React.ComponentPropsWithoutRef<typeof DateTimePicker>,
    "date" | "setDate"
  >;
};

export const FormDateTimeController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  picker = {},
  ...props
}: FormDateTimeControllerProps<TFieldValues, TName>) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {/*eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <DateTimePicker
            date={field.value}
            setDate={field.onChange}
            {...picker}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const Form = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = FieldValues,
>({
  children,
  onSubmit,
  className,
  ...props
}: FormProviderProps<TFieldValues, TContext, TTransformedValues> & {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  className?: string;
}) => {
  return (
    <FormLib {...props}>
      <form
        onSubmit={onSubmit}
        className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
      >
        {children}
      </form>
    </FormLib>
  );
};
