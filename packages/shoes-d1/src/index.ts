import { AnyD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "../models/schema.js";

export { shoes } from "../models/schema.js";

export function createD1Client(db: AnyD1Database) {
  return drizzle(db, { schema });
}
