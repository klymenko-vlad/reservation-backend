import { InferSelectModel, sql } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export enum PropertyCategory {
  HOTEL = 'HOTEL',
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  ROOM = 'ROOM',
}

export const PropertyCategoryEnum = pgEnum('property_category', [
  PropertyCategory.HOTEL,
  PropertyCategory.APARTMENT,
  PropertyCategory.HOUSE,
  PropertyCategory.ROOM,
]);

export const properties = pgTable('properties', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  priceFerNightCents: integer('price_per_night_cents').notNull(),
  description: text('description').notNull(),
  category: PropertyCategoryEnum('category').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`,
  ),
});

export type Property = InferSelectModel<typeof properties>;
