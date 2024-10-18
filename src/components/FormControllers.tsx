import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type FormProviderProps,
} from "react-hook-form";
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
  FormMessage,
  Form as FormLib,
} from "./ui/form";
import { Input, type InputProps } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";

type FormInputControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  input: InputProps;
  label: string;
};

export const FormInputController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  input: { type = "text", ...input },
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
            <Input {...input} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type FormSelectControllerProps = Omit<
  React.ComponentPropsWithoutRef<typeof FormField>,
  "render"
> & {
  placeholder: string;
  label: string;
  options: (item: typeof SelectItem) => JSX.Element;
};

export const FormSelectController = ({
  placeholder,
  label,
  options,
  ...props
}: FormSelectControllerProps) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {/*eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{options(SelectItem)}</SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type FormComboboxControllerProps = Omit<
  React.ComponentPropsWithoutRef<typeof FormField>,
  "render"
> & {
  placeholder: string;
  label: string;
  searchPlaceholder: string;
  emptyMessage: string;
  options: (item: typeof ComboboxItem) => JSX.Element;
};

export const FormComboboxController = ({
  label,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  options,
  ...props
}: FormComboboxControllerProps) => {
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
      <form onSubmit={onSubmit} className={cn("grid gap-4", className)}>
        {children}
      </form>
    </FormLib>
  );
};
