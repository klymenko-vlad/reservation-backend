import { InferSelectModel, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const PropertyCategory = pgEnum('item_category', [
  'HOTEL',
  'APARTMENT',
  'HOUSE',
  'ROOM',
]);

export const properties = pgTable('items', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: PropertyCategory('category').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`,
  ),
});

export type Property = InferSelectModel<typeof properties>;
