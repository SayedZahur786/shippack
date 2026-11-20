import { NextRequest, NextResponse } from "next/server";
export function origin(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin)
    throw new Error("Request origin rejected.");
}
export function failure(e: unknown) {
  const message = e instanceof Error ? e.message : "";
  const safe =
    /^(Use a public|Repository unavailable|Repository is too large|ZIP |Unsafe ZIP|Hourly capacity|Open a fresh|Pack expired|Database setup|Request origin|Payment |Generation |Upload |Enter |Full packs)/.test(
      message,
    );
  return NextResponse.json(
    {
      error: safe
        ? message
        : "This request could not be completed. Please retry.",
    },
    { status: 400 },
  );
}
export const paymentsReady = () =>
  Boolean(
    process.env.STRIPE_SECRET_KEY &&
    process.env.OPENAI_API_KEY &&
    process.env.DATABASE_URL,
  );
export async function boundedBody(req: NextRequest, max: number) {
  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new Error("Upload is too large.");
    }
    chunks.push(value);
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
