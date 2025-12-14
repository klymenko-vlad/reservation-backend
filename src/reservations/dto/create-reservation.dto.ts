import { ReservationStatusEnum } from '../../database/schema/reservation.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'property-uuid-5678' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ example: '2024-07-01T14:00:00Z' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-07-05T11:00:00Z' })
  @IsDate()
  endDate: Date;

  @ApiProperty({
    example: ReservationStatusEnum.PENDING,
    enum: ReservationStatusEnum,
  })
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;
}
