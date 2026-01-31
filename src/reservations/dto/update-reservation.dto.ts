import { ReservationStatusEnum } from '../../database/schema/reservation.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReservationDto {
  @ApiProperty({ example: 'property-uuid-5678', required: false })
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @ApiProperty({ example: '2024-07-01T14:00:00Z', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ example: '2024-07-05T11:00:00Z', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    example: ReservationStatusEnum.PENDING,
    enum: ReservationStatusEnum,
    required: false,
  })
  @IsEnum(ReservationStatusEnum)
  @IsOptional()
  status?: ReservationStatusEnum;
}
