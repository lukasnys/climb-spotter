import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const shoes = sqliteTable("shoes", {
	id: integer().primaryKey({ autoIncrement: true }),
	scrapedName: text(),
});

