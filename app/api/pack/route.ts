import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, owned, limit } from "../../../lib/db";
import { generate } from "../../../lib/generate";
import { failure, origin } from "../../../lib/http";
export const maxDuration = 90;
export async function GET() {
  try {
    const p = await owned();
    return NextResponse.json({
      analysis: p.analysis,
      content: p.paid ? p.content : null,
      paid: p.paid,
    });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: NextRequest) {
  try {
    origin(req);
    const p = await owned();
    await limit(`generate:${p.id}`);
    if (!p.paid) {
      if (!process.env.STRIPE_SECRET_KEY || !p.stripe_session)
        throw new Error("Payment has not been completed.");
      const session = await new Stripe(
        process.env.STRIPE_SECRET_KEY,
      ).checkout.sessions.retrieve(p.stripe_session);
      if (
        session.payment_status !== "paid" ||
        session.amount_total !== 500 ||
        session.currency !== "usd" ||
        session.client_reference_id !== p.id
      )
        throw new Error("Payment is pending. Retry after checkout completes.");
      await db()`UPDATE packs SET paid=true WHERE id=${p.id}`;
    }
    let content = p.content;
    if (!content) {
      const lease =
        await db()`UPDATE packs SET generation_started_at=now() WHERE id=${p.id} AND content IS NULL AND (generation_started_at IS NULL OR generation_started_at < now()-interval '90 seconds') RETURNING id`;
      if (!lease.length)
        throw new Error("Generation is already running. Retry in a moment.");
      try {
        content = await generate(p.analysis);
      } catch (error) {
        await db()`UPDATE packs SET generation_started_at=NULL WHERE id=${p.id}`;
        throw error;
      }
    }
    await db()`UPDATE packs SET content=${JSON.stringify(content)}::jsonb, generation_started_at=NULL WHERE id=${p.id}`;
    return NextResponse.json({ analysis: p.analysis, content, paid: true });
  } catch (e) {
    return failure(e);
  }
}
