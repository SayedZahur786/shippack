# ShipPack execution plan

Primary persona: a student builder with a working hackathon prototype, six hours left, and nobody assigned to submission writing. Core job: turn implemented code into a clear, judge-readable submission without inventing accomplishments.

The smallest lovable version accepts a public GitHub URL or bounded ZIP, shows evidence-backed stack and features, produces a free filled judging checklist, and unlocks README, Devpost prose, a two-minute demo script and ZIP for a single $5 purchase. No video editing, Devpost integration or team accounts.

## Competitive research — 21 November 2026

| Alternative | Offer and charge | Friction and opportunity |
| --- | --- | --- |
| [Devpost](https://info.devpost.com/faqs-participants) | Free participant account and structured submission fields | Its own guidance asks builders to reserve time for descriptions and filming. ShipPack prepares the writing from code. |
| [ChatGPT](https://chatgpt.com/pricing/) | Free tier plus paid subscriptions; live page does not reliably expose numeric regional pricing | Prompting and checking provenance remain manual. ShipPack fixes the output format and attaches source evidence. |
| [readme.so](https://readme.so/) | Browser README section editor; no charge advertised | Manual customization, focused on README. ShipPack bundles the judging story and script. |
| [ReadmeAI](https://github.com/eli64s/readme-ai) | Open-source CLI; external model usage may cost money; offline mode available | Maintainer warns its web app can lag CLI features. ShipPack makes a focused browser workflow. |

These are observed product limitations, not invented customer complaints. Independent complaint interviews are still needed. Hypothesis: consistency across four artifacts is worth $5 even when general chat is free. Cheapest test: offer the real checkout to 30 teams at one campus event; measure checklist completion, paid pack completion and conversion. Targets: 300 completed checklists, 20 paid packs, 6.7% conversion.

## Architecture and states

Next.js server routes fetch only allowlisted GitHub API paths; ZIP processing never executes or extracts repository code. Heuristics retain evidence paths. Optional paid LLM writing receives bounded source summaries and must not claim unverified achievements. Neon stores expiring packs, hashed bearer access tokens, rate windows and Stripe session IDs. Browser session owns its pack through a secure HttpOnly cookie. A verified Stripe session bound to that pack is the only payment authority.

Routes: / landing; /pack workspace; /privacy; /terms; /api/analyze; /api/checkout; /api/pack; /api/export. States: empty, analyzing, checklist ready, checkout unavailable, payment pending, paid, generation failure with retry, export ready. Sample workspace is explicitly labeled and separate from paid user packs.

## Delivery order

1. Foundation and read-only kit integration.
2. Bounded analysis, deterministic free checklist, authenticated paid generation and ZIP export.
3. Tests, real browser screenshots, narrated recording, security audit, four kit gates.
4. GitHub and Vercel publication when authenticated; document account blockers without claiming launch.
