import { registerDecorator, ValidationOptions } from 'class-validator';
import { isValidTimezone } from '@common/utils/timezone.util';

export function IsTimezone(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyKey) => {
    registerDecorator({
      name: 'isTimezone',
      target: target.constructor,
      propertyName: String(propertyKey),
      options: {
        message: `${String(propertyKey)} must be a valid IANA timezone`,
        ...options,
      },
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' && isValidTimezone(value),
      },
    });
  };
}
