import { PropertyCategory } from '../../database/schema/property.schema';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @ApiProperty({ example: 'Oceanview Hotel' })
  name: string;

  @ApiProperty({
    example: 12000,
    description: 'Price per night in cents',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  priceFerNightCents: number;

  @IsString()
  @MinLength(5)
  @MaxLength(800)
  @ApiProperty({ example: 'A beautiful hotel with stunning ocean views.' })
  description: string;

  @ApiProperty({ example: PropertyCategory.HOTEL, enum: PropertyCategory })
  @IsEnum(PropertyCategory)
  category: PropertyCategory;
}
