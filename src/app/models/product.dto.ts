import {
  IsDateString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductInterface } from '../interfaces/product.interface';
import {
  IsReleaseDateValid,
  IsRevisionDateValid,
} from '../utils/class-validator';

export class ProductDTO implements ProductInterface {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  id: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  logo: string;

  @IsNotEmpty()
  @IsDateString()
  @IsReleaseDateValid({
    message: 'La fecha de liberación debe ser igual o mayor a la fecha actual.',
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_release: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsRevisionDateValid({
    message:
      'La fecha de revisión debe ser exactamente un año posterior a la fecha de liberación.',
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_revision: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    logo: string,
    date_release: Date,
    date_revision: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.logo = logo;
    this.date_release = date_release;
    this.date_revision = date_revision;
  }
}
