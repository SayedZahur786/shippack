import { owned } from "../../../lib/db";
import { packZip } from "../../../lib/zip";
import { failure } from "../../../lib/http";
export async function GET() {
  try {
    const p = await owned();
    if (!p.paid || !p.content)
      throw new Error("Payment and generation must complete before export.");
    return new Response(Buffer.from(packZip(p.content)), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="shippack.zip"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return failure(e);
  }
}
