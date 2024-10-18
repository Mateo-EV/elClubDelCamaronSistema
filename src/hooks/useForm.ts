"use client";

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
  onSubmit: (
    values: TFieldValues,
    form: UseFormReturn<TFieldValues, TContext, undefined>,
  ) => Promise<void> | void;
} & Omit<UseFormProps<TFieldValues, TContext>, "resolver">;

const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
>({
  schema,
  onSubmit: onSubmitHook,
  ...props
}: useFormProps<TFieldValues, TContext>) => {
  const useFormData = useFormLib<TFieldValues, TContext, undefined>({
    resolver: zodResolver(schema),
    ...props,
  });

  const onSubmit = useFormData.handleSubmit(
    async (values) => await onSubmitHook(values, useFormData),
  );

  return { onSubmit, ...useFormData };
};

export default useForm;
