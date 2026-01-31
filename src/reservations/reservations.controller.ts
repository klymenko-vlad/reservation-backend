import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../database/schema';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { UpdateReservationDto } from './dto/update-reservation.dto';

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

  @Delete(':id')
  @Permissions('reservation:delete')
  deleteReservation(@CurrentUser() user: User, @Param('id') id: string) {
    return this.reservationsService.deleteReservation(user.id, id);
  }

  @Patch(':id')
  @Permissions('reservation:update')
  updateReservation(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateReservation(
      user.id,
      id,
      updateReservationDto,
    );
  }
}
