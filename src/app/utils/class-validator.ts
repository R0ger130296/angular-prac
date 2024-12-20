import { ValidationArguments, registerDecorator } from 'class-validator';
import { ProductDTO } from '../models/product.dto';

// Validador para asegurarse de que la fecha de liberación sea >= a la fecha actual
export function IsReleaseDateValid(validationOptions?: any) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsReleaseDateValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const currentDate = new Date();
          return new Date(value) >= currentDate;
        },
        defaultMessage() {
          return 'La fecha de liberación debe ser igual o mayor a la fecha actual.';
        },
      },
    });
  };
}

// Validador para asegurarse de que la fecha de revisión es un año posterior a la fecha de liberación
export function IsRevisionDateValid(validationOptions?: any) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsRevisionDateValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['date_release'],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const releaseDate = (args.object as ProductDTO).date_release;
          const releaseDatePlusOneYear = new Date(releaseDate);
          releaseDatePlusOneYear.setFullYear(releaseDate.getFullYear() + 1);
          return (
            new Date(value).toISOString() ===
            releaseDatePlusOneYear.toISOString()
          );
        },
        defaultMessage() {
          return 'La fecha de revisión debe ser exactamente un año posterior a la fecha de liberación.';
        },
      },
    });
  };
}
