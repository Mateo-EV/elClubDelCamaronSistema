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
            defaultValue={String(field.value)}
          >
            <FormControl>
              <SelectTrigger>
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
  options: (
    item: typeof ComboboxItem,
  ) => JSX.Element | JSX.Element[] | undefined;
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
          <Combobox onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <ComboboxTrigger>
                <ComboboxValue placeholder={placeholder} />
              </ComboboxTrigger>
            </FormControl>
            <ComboboxContent
              emptyMessage={emptyMessage}
              searchPlaceholder={searchPlaceholder}
            >
              {options(ComboboxItem)}
            </ComboboxContent>
          </Combobox>
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
