import { unzipSync, strFromU8, zipSync, strToU8 } from "fflate";
import type { Source, Pack } from "./analyze";
export function readZip(bytes: Uint8Array): Source[] {
  if (bytes.length > 3_000_000) throw new Error("ZIP must be under 3 MB.");
  let total = 0,
    count = 0;
  const entries = unzipSync(bytes, {
    filter: (f) => {
      count++;
      total += f.originalSize;
      if (count > 1500 || total > 12_000_000 || f.originalSize > 300_000)
        throw new Error("ZIP expands beyond safe limits.");
      if (
        f.name.includes("..") ||
        f.name.startsWith("/") ||
        f.name.includes("\\")
      )
        throw new Error("Unsafe ZIP path.");
      return (
        /\.(json|tsx?|jsx?|py|sol|md)$/.test(f.name) &&
        !/(^|\/)(node_modules|\.git|\.env|vendor|dist)(\/|$)/.test(f.name) &&
        !/(secret|credential|lock)/i.test(f.name)
      );
    },
  });
  return Object.entries(entries)
    .slice(0, 150)
    .map(([path, b]) => ({ path, content: strFromU8(b).slice(0, 12000) }));
}
export function packZip(p: Pack) {
  return zipSync(
    Object.fromEntries(
      Object.entries(p).map(([k, v]) => [
        `${k === "readme" ? "README" : k}.md`,
        strToU8(v),
      ]),
    ),
  );
}
