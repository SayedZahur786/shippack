import { spawnSync } from "node:child_process";
for (const key of ["DATABASE_URL", "NEXT_PUBLIC_SITE_URL"]) {
  const value =
    key === "NEXT_PUBLIC_SITE_URL"
      ? "https://shippack-zeta.vercel.app"
      : process.env[key];
  if (!value) throw new Error("Missing " + key);
  const r = spawnSync("vercel", ["env", "add", key, "production", "--force"], {
    input: value,
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error("Environment upload failed: " + key);
  console.log("Configured " + key);
}
