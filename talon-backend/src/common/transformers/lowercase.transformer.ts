import { Transform, TransformFnParams } from 'class-transformer';

export const Lowercase = () =>
  Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );
