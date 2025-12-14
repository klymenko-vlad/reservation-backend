import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../database/schema';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Permissions('reservation:create')
  createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: User,
  ) {
    return this.reservationsService.createReservation(
      user.id,
      createReservationDto,
    );
  }

  @Get()
  @Permissions('reservation:read')
  getAllReservations(@CurrentUser() user: User) {
    return this.reservationsService.getAllReservations(user.id);
  }

  @Get(':id')
  @Permissions('reservation:read')
  getReservationById(@CurrentUser() user: User, @Param('id') id: string) {
    return this.reservationsService.getReservationById(user.id, id);
  }
}
