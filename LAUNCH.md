# ShipPack launch record

Status: free preview, not a completed paid launch.

- Live: https://shippack-zeta.vercel.app
- Repository: https://github.com/SayedZahur786/shippack (private)
- Local: `npm run dev` → http://localhost:3000
- Deployment: `vercel deploy --prod --yes` from this folder; only server-side DATABASE_URL and public canonical URL are configured.
- Neon: project young-dust-61719572; production branch br-snowy-bar-aoxfa286; existing organization org-sweet-wildflower-67376060. Dedicated app database; fresh organization creation requires account-owner action.

## Release checks

- Production build: PASS using Next.js webpack.
- Unit tests: PASS, seven core cases.
- Browser tests: PASS, desktop/mobile routes, sample Devpost and ZIP, signed-out denial, foreign-origin rejection, real public repo to Neon-backed checklist.
- Dependency audit: PASS, zero vulnerabilities.
- Placeholder scan: PASS before final documentation; rerun at final commit.
- Header check: result recorded after final deployment.
- Policy check: result recorded after final deployment.
- Performance check: PASS, 612/664/564 ms cold mobile LCP, worst 664 ms. Local lab only.
- Paid end-to-end: BLOCKED; no Stripe/OpenAI keys. No fabricated paid result.

## Human needed

1. Add OPENAI_API_KEY and a Stripe test-mode STRIPE_SECRET_KEY to local and Vercel server environments. Exercise real model generation, paid checkout, cancelled payment, retry, ownership and export, then configure live Stripe only when ready to sell.
2. Establish a private support/refund contact and complete the remaining paid-launch security checks in docs/security-audit.md.
3. Approve making the GitHub repository public if desired. Automatic approval review rejected the public push due to source/configuration disclosure risk; the repository is private.
4. Create a separate Neon organization if organization-level isolation is mandatory; the CLI supports project creation but no organization creation.
5. Review and post the channel drafts below. No outreach was sent.

## Week-one metrics

Run the SQL below in Neon before seven-day pack expiry. Test records must be excluded from a real launch measurement; collect a baseline at launch. Counts represent pack creations, not unique people. A paid pack means verified payment plus stored content, not merely a checkout visit.

```sql
SELECT count(*) AS completed_checklists,
 count(*) FILTER (WHERE paid AND content IS NOT NULL) AS completed_paid_packs,
 round(100.0 * count(*) FILTER (WHERE paid AND content IS NOT NULL) / nullif(count(*),0), 2) AS paid_conversion_percent
FROM packs WHERE created_at >= now() - interval '7 days';
```

Targets: 300 completed checklists; 20 completed paid packs; 6.7% checklist-to-paid conversion during one hackathon weekend. These are goals, not results. Analytics tracking is disabled; the operational counters appear in the SQL result.

## Launch copy adapted from the shared launch-post template

### Hackathon Discords

Still writing your submission while everyone else rehearses? I built ShipPack to turn a public GitHub repo or ZIP into a free, judge-focused checklist. There’s a sample README, Devpost story and demo script you can explore and export. Paid generation is not open yet. Try the preview: https://shippack-zeta.vercel.app — which part of your submission takes longest?

### Devpost project description

ShipPack focuses on the final handoff from working code to a clear hackathon submission. It detects stack and source evidence, then prepares a problem/solution/demo/tech checklist. The preview includes an exportable sample pack. It does not submit to Devpost or verify hackathon eligibility. Full $5 generation is awaiting payment and model configuration. Project: https://shippack-zeta.vercel.app

### ETHGlobal community

For builders preparing a hackathon demo: ShipPack’s free preview helps organize repository evidence into a judging checklist. Solidity files are detected, but contracts are never executed or audited. Explore a sample submission and timed demo storyboard: https://shippack-zeta.vercel.app. Paid generation remains closed. Feedback on what judges need to see would help.

### Campus hackathon organisers

I’m testing ShipPack for teams in their final 24 hours: a free repo-based checklist plus an exportable sample submission pack. Would a voluntary submission-writing clinic be useful at your next event? The goal is clearer explanations, not inflated claims or automated judging. Preview: https://shippack-zeta.vercel.app. Paid generation is not yet enabled; no event partnership is claimed.

### X

Built the app, still staring at the submission form? ShipPack turns repo evidence into a free judging checklist. Explore a sample README, Devpost story and demo script. Paid generation isn’t open yet. https://shippack-zeta.vercel.app

### LinkedIn

The final hours of a hackathon often involve four writing tasks at once. ShipPack brings a repository-based checklist, README, Devpost story and demo outline into one workflow. The free preview and labeled sample export are available today; paid generation awaits service setup. I’m looking for feedback from participants and organisers: https://shippack-zeta.vercel.app

### Show HN

Title: Show HN: ShipPack – hackathon submission packs from repo evidence

URL: https://shippack-zeta.vercel.app

Next.js, bounded ZIP inspection, allowlisted GitHub requests and Neon-backed expiring packs. The free checklist works; the model and payment adapters exist but live paid delivery is not validated. The sample is explicitly fictional. What would make a generated submission trustworthy enough to use under a deadline?
