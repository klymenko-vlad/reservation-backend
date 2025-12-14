import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { reservations } from '../database/schema/reservation.schema';
import { eq } from 'drizzle-orm';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly drizzleService: DatabaseService) {}

  async getAllReservations(userId: string) {
    return this.drizzleService.db
      .select()
      .from(reservations)
      .where(eq(reservations.userId, userId));
  }

  async getReservationById(userId: string, id: string) {
    const result = await this.drizzleService.db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id));

    if (!result[0] || result[0].userId !== userId) {
      throw new NotFoundException('Reservation not found');
    }

    return result[0];
  }

  async createReservation(
    userId: string,
    reservationData: CreateReservationDto,
  ) {
    // TODO: Handle no property

    const result = await this.drizzleService.db
      .insert(reservations)
      .values({ userId, ...reservationData })
      .returning();

    return result[0];
  }
}
