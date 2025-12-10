import { InferSelectModel, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { properties } from './property.schema';

export const ReservationStatus = pgEnum('reservation_status', [
  'PENDING',
  'CONFIRMED',
  'CANCELED',
  'COMPLETED',
]);

export const reservations = pgTable('reservations', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  propertyId: text('property_id')
    .notNull()
    .references(() => properties.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: ReservationStatus('status').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`,
  ),
});

export type Reservation = InferSelectModel<typeof reservations>;
