import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);
for (const statement of readFileSync("migrations/001_initial.sql", "utf8")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean))
  await sql.query(statement);
console.log("Migration applied.");
