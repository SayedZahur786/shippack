import type { Source } from "./analyze";
export function repoPath(input: string) {
  const u = new URL(input);
  if (
    u.protocol !== "https:" ||
    u.hostname !== "github.com" ||
    u.username ||
    u.password ||
    u.port ||
    u.search ||
    u.hash ||
    !/^\/[\w.-]+\/[\w.-]+\/?$/.test(u.pathname)
  )
    throw new Error("Use a public github.com owner/repository URL.");
  return u.pathname.replace(/\/$/, "").replace(/\.git$/, "");
}
export async function github(
  input: string,
): Promise<{ name: string; files: Source[] }> {
  const path = repoPath(input);
  const deadline = AbortSignal.timeout(60000);
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ShipPack",
  };
  async function get(suffix: string) {
    const r = await fetch(`https://api.github.com/repos${path}${suffix}`, {
      headers,
      redirect: "error",
      signal: AbortSignal.any([deadline, AbortSignal.timeout(12000)]),
    });
    if (!r.ok)
      throw new Error(
        "Repository unavailable or GitHub rate limit reached. Try a ZIP instead.",
      );
    const body = await r.text();
    if (body.length > 3_000_000)
      throw new Error("Repository tree is too large.");
    return JSON.parse(body);
  }
  const meta = await get("");
  const tree = await get(
    `/git/trees/${encodeURIComponent(meta.default_branch)}?recursive=1`,
  );
  if (tree.truncated)
    throw new Error("Repository is too large; upload a focused source ZIP.");
  const items = tree.tree
    .filter(
      (x: { type: string; path: string; size: number }) =>
        x.type === "blob" &&
        x.size < 300000 &&
        !/(node_modules|\.env|secret|credential|lock)/i.test(x.path) &&
        /\.(json|tsx?|jsx?|py|sol|md)$/.test(x.path),
    )
    .slice(0, 100);
  const files: Source[] = items.map((x: { path: string }) => ({
    path: x.path,
    content: "",
  }));
  for (const f of files
    .filter((f) => /package\.json$|README\.md$/i.test(f.path))
    .slice(0, 5)) {
    const blob = items.find((x: { path: string }) => x.path === f.path);
    const data = await get(`/git/blobs/${blob.sha}`);
    f.content = Buffer.from(data.content, "base64")
      .toString("utf8")
      .slice(0, 12000);
  }
  return { name: meta.name, files };
}
