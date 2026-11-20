import { NextRequest, NextResponse } from "next/server";
import { analyze } from "../../../lib/analyze";
import { github } from "../../../lib/github";
import { readZip } from "../../../lib/zip";
import { limit, save } from "../../../lib/db";
import { origin, failure, boundedBody } from "../../../lib/http";
export const maxDuration = 90;
export async function POST(req: NextRequest) {
  try {
    origin(req);
    await limit("analysis-global");
    if (Number(req.headers.get("content-length") || 0) > 3_100_000)
      throw new Error("Upload is too large.");
    const bytes = await boundedBody(req, 3_100_000);
    const safeRequest = new Request(req.url, {
      method: "POST",
      headers: req.headers,
      body: new Uint8Array(bytes),
    });
    let source;
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const f = (await safeRequest.formData()).get("file");
      if (
        !(f instanceof File) ||
        !f.name.endsWith(".zip") ||
        f.size > 3_000_000
      )
        throw new Error("Upload a ZIP under 3 MB.");
      source = {
        name: f.name.replace(/\.zip$/, ""),
        files: readZip(new Uint8Array(await f.arrayBuffer())),
      };
    } else {
      const text = await safeRequest.text();
      if (text.length > 2048)
        throw new Error("Enter a shorter repository URL.");
      source = await github(JSON.parse(text).url);
    }
    if (!source.files.length)
      throw new Error("ZIP contains no supported source files.");
    const analysis = analyze(source.files, source.name);
    await save(analysis);
    return NextResponse.json({ analysis });
  } catch (e) {
    return failure(e);
  }
}
