import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm as useFormLib,
  type UseFormReturn,
  type FieldValues,
  type UseFormProps,
} from "react-hook-form";
import { type z } from "zod";

type useFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<TFieldValues, any, unknown>;
} & Omit<UseFormProps<TFieldValues, TContext>, "resolver"> &
  (
    | {
        onSubmit: (
          values: TFieldValues,
          form: UseFormReturn<TFieldValues, TContext, undefined>,
        ) => Promise<void> | void;
        onFastSubmit?: undefined;
      }
    | {
        onFastSubmit: (values: TFieldValues) => void;
        onSubmit?: undefined;
      }
  );

const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
>({
  schema,
  onSubmit: onSubmitHook,
  onFastSubmit: onFastSubmitHook,
  ...props
}: useFormProps<TFieldValues, TContext>) => {
  const useFormData = useFormLib<TFieldValues, TContext, undefined>({
    resolver: zodResolver(schema),
    ...props,
  });

  const onSubmit = useFormData.handleSubmit(async (values) => {
    if (onFastSubmitHook) {
      onFastSubmitHook(values);
    } else {
      await onSubmitHook(values, useFormData);
    }
  });

  return { onSubmit, ...useFormData };
};

export default useForm;
