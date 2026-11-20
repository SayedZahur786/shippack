import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { Analysis, Pack } from "./analyze";
export function db() {
  if (!process.env.DATABASE_URL)
    throw new Error(
      "Database setup is not complete. The sample preview is available.",
    );
  return neon(process.env.DATABASE_URL);
}
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export async function limit(key: string) {
  const sql = db();
  const rows =
    await sql`INSERT INTO rate_windows(key,hits,expires_at) VALUES(${key},1,now()+interval '1 hour') ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN rate_windows.expires_at<now() THEN 1 ELSE rate_windows.hits+1 END, expires_at=CASE WHEN rate_windows.expires_at<now() THEN now()+interval '1 hour' ELSE rate_windows.expires_at END RETURNING hits`;
  if (rows[0].hits > 30)
    throw new Error("Hourly capacity reached. Please try again later.");
}
export async function save(analysis: Analysis) {
  const sql = db();
  const token = randomBytes(32).toString("hex"),
    id = randomUUID();
  await sql`DELETE FROM packs WHERE expires_at<now()`;
  await sql`DELETE FROM rate_windows WHERE expires_at<now()`;
  await sql`INSERT INTO packs(id,token_hash,analysis) VALUES(${id},${hash(token)},${JSON.stringify(analysis)}::jsonb)`;
  (await cookies()).set("shippack", `${id}.${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  });
  return id;
}
export async function owned() {
  const value = (await cookies()).get("shippack")?.value;
  const [id, token] = value?.split(".") || [];
  if (!id || !token || !/^[-a-f0-9]{36}$/.test(id))
    throw new Error("Open a fresh checklist to access a pack.");
  const rows =
    await db()`SELECT * FROM packs WHERE id=${id} AND token_hash=${hash(token)} AND expires_at>now()`;
  if (!rows.length) throw new Error("Pack expired or access denied.");
  return rows[0] as {
    id: string;
    analysis: Analysis;
    content: Pack | null;
    paid: boolean;
    stripe_session: string | null;
  };
}
