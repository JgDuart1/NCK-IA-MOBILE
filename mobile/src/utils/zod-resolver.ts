import { FieldValues, Resolver } from 'react-hook-form';
import { ZodSchema } from 'zod';

export function zodResolver<TFieldValues extends FieldValues>(
  schema: ZodSchema<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const errors = Object.keys(fieldErrors).reduce<Record<string, any>>((acc, key) => {
      const message = fieldErrors[key]?.[0];
      if (message) {
        acc[key] = { type: 'validation', message };
      }
      return acc;
    }, {});

    return {
      values: {},
      errors,
    };
  };
}
