import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
const sql = neon(process.env.DATABASE_URL_UNPOOLED);
const existing = await sql`SELECT 1 FROM pg_roles WHERE rolname='shippack_app'`;
if (existing.length)
  throw new Error("App role already exists; no rotation performed.");
const password = randomBytes(32).toString("hex");
await sql.query(`CREATE ROLE shippack_app LOGIN PASSWORD '${password}'`);
await sql.query("GRANT CONNECT ON DATABASE neondb TO shippack_app");
await sql.query("GRANT USAGE ON SCHEMA public TO shippack_app");
await sql.query(
  "GRANT SELECT, INSERT, UPDATE, DELETE ON packs, rate_windows TO shippack_app",
);
const url = new URL(process.env.DATABASE_URL);
url.username = "shippack_app";
url.password = password;
const text = readFileSync(".env.local", "utf8").replace(
  /^DATABASE_URL=.*$/m,
  `DATABASE_URL="${url.toString()}"`,
);
writeFileSync(".env.local", text, { mode: 0o600 });
console.log(
  "Restricted app role created; local app connection updated. Migration owner connection retained.",
);
