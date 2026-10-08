import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const heroSection = pgTable("hero_section", {
  id: integer().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  subtitle: varchar({ length: 255 }).notNull(),
  imgSrc: varchar({ length: 255 }).notNull(),
  btnText: varchar({ length: 255 }),
  btnLink: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
