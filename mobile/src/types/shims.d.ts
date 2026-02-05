declare module 'expo-constants' {
  const Constants: any;
  export default Constants;
}

declare module 'expo-status-bar' {
  import * as React from 'react';

  export const StatusBar: React.ComponentType<any>;
}

declare module 'react-hook-form' {
  import * as React from 'react';

  export type FieldValues = Record<string, any>;

  export type Resolver<TFieldValues extends FieldValues = FieldValues> = (
    values: TFieldValues
  ) => Promise<{ values: TFieldValues | {}; errors: Record<string, any> }>;

  export interface UseFormStateReturn<TFieldValues extends FieldValues = FieldValues> {
    errors: Record<string, { message?: string } | undefined>;
  }

  export interface UseFormReturn<TFieldValues extends FieldValues = FieldValues> {
    control: unknown;
    handleSubmit: (fn: (data: TFieldValues) => void | Promise<void>) => () => void;
    formState: UseFormStateReturn<TFieldValues>;
    setValue: (name: keyof TFieldValues & string, value: any) => void;
    watch: (name?: keyof TFieldValues & string) => any;
    reset: (values?: Partial<TFieldValues>) => void;
  }

  export function useForm<TFieldValues extends FieldValues = FieldValues>(
    options?: Record<string, any>
  ): UseFormReturn<TFieldValues>;

  export interface ControllerProps<TFieldValues extends FieldValues = FieldValues> {
    control: unknown;
    name: keyof TFieldValues & string;
    render: (props: {
      field: { onChange: (value: any) => void; value: any };
    }) => React.ReactElement;
  }

  export function Controller<TFieldValues extends FieldValues = FieldValues>(
    props: ControllerProps<TFieldValues>
  ): JSX.Element;
}
