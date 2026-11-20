import test from "node:test";
import assert from "node:assert/strict";
import { analyze, draft, sample, sampleFiles } from "../lib/analyze";
import { repoPath } from "../lib/github";
import { readZip, packZip } from "../lib/zip";
import { zipSync, strToU8, unzipSync, strFromU8 } from "fflate";
test("detect stack and evidence without treating dependencies as proof", () => {
  const a = analyze(sampleFiles, "CampusPlate");
  assert.deepEqual(a.stack, ["Next.js", "React", "TypeScript", "Neon"]);
  assert.equal(a.features[0].path, "app/api/food/route.ts");
  assert.match(a.checklist[0].detail, /cannot be verified/);
  assert.equal(a.checklist.length, 4);
});
test("malformed manifests do not break analysis", () =>
  assert.deepEqual(
    analyze([{ path: "package.json", content: "broken" }], "Demo").stack,
    [],
  ));
test("draft includes all artifacts and no fabricated measured impact", () => {
  const p = draft(sample);
  assert.match(p.devpost, /## What it does/);
  assert.match(p.script, /1:50–2:00/);
  assert.match(p.readme, /execution|runtime/);
  assert.equal(Object.keys(p).length, 4);
});
test("SSRF inputs are denied", () => {
  for (const url of [
    "http://github.com/a/b",
    "https://github.com.evil.org/a/b",
    "https://user:pass@github.com/a/b",
    "https://127.0.0.1/a/b",
    "https://github.com/a/b/tree/main",
    "https://github.com/a/b?q=1",
  ])
    assert.throws(() => repoPath(url));
  assert.equal(
    repoPath("https://github.com/vercel/next.js"),
    " /vercel/next.js".trim(),
  );
});
test("ZIP traversal and expansion rejected", () => {
  assert.throws(
    () => readZip(zipSync({ "../x.ts": strToU8("bad") })),
    /Unsafe/,
  );
  assert.throws(
    () => readZip(zipSync({ "large.ts": new Uint8Array(400000) })),
    /limits/,
  );
});
test("ZIP roundtrip contains four readable artifacts", () => {
  const p = draft(sample);
  const files = unzipSync(packZip(p));
  assert.equal(Object.keys(files).length, 4);
  assert.equal(strFromU8(files["devpost.md"]), p.devpost);
});
test("ZIP excludes secrets and vendor files", () => {
  const files = readZip(
    zipSync({
      "src/app.ts": strToU8("hello"),
      "node_modules/a.ts": strToU8("dependency"),
      "credentials.json": strToU8("private"),
    }),
  );
  assert.equal(files.length, 1);
});
