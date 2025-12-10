import { InferSelectModel, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

// Define status enum
export const reservationStatusEnum = pgEnum('reservation_status', [
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
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: reservationStatusEnum('status').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`,
  ),
});

export type Reservation = InferSelectModel<typeof reservations>;
