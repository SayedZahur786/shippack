import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, owned, limit } from "../../../lib/db";
import { origin, failure, paymentsReady } from "../../../lib/http";
export async function POST(req: NextRequest) {
  try {
    origin(req);
    if (!paymentsReady())
      throw new Error(
        "Full packs are not open for payment yet. Your checklist is free.",
      );
    const p = await owned();
    await limit(`checkout:${p.id}`);
    if (p.paid) return NextResponse.json({ url: "/pack" });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    if (p.stripe_session) {
      const old = await stripe.checkout.sessions.retrieve(p.stripe_session);
      if (old.status === "open" && old.url)
        return NextResponse.json({ url: old.url });
      if (old.payment_status === "paid")
        return NextResponse.json({ url: "/pack" });
    }
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: p.id,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 500,
              product_data: { name: "ShipPack submission pack" },
            },
            quantity: 1,
          },
        ],
        success_url: `${req.nextUrl.origin}/pack?payment=returned`,
        cancel_url: `${req.nextUrl.origin}/pack`,
        metadata: { pack_id: p.id },
      },
      { idempotencyKey: `pack-${p.id}` },
    );
    await db()`UPDATE packs SET stripe_session=${session.id} WHERE id=${p.id}`;
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return failure(e);
  }
}
