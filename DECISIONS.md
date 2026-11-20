# Decisions

- 2026-11-21: Work exclusively in shippack; parent ignore already excludes all project folders. Standalone Git initialized before implementation.
- Use public GitHub repositories and ZIPs only; no access to private hosting credentials in v1.
- Browser owns one pack via a random bearer cookie, stored hashed in Neon. No accounts or team feature.
- Model and payments fail closed when credentials are absent. A clearly labeled built-in sample remains usable locally, including export.
- Record a real Playwright walkthrough with macOS speech narration and large captions. This demonstrates actual controls and avoids implying an unverified hosted purchase. The user explicitly selected Playwright as an allowed video framework; no HyperFrames composition needed.
- GitHub CLI reported invalid authentication; publication requires renewed login unless a permitted authenticated retry succeeds.
- Analytics kit component is included with consent false. Operational counts come from expiring database records; no tracking SDK.
- Neon organization: org-sweet-wildflower-67376060; dedicated project: young-dust-61719572 (Singapore). The CLI has no organization-create command and its API rejects /organizations. Existing organization used; no databases or branches shared with other apps. A fresh organization remains an account-owner action if strict org isolation is required.
- Read the installed Neon PostgreSQL skill. HTTP serverless driver is retained for bounded one-shot queries, with pooled app URL and direct migration URL. No long-lived pool is needed for this workload.
- Local Turbopack process binding is blocked in this host; standard Next.js webpack production build succeeds. Build script uses webpack consistently, including Vercel.
- Preview deployed at https://shippack-zeta.vercel.app (Vercel assigned this alias). Canonical metadata corrected to that URL.
- Public source publication was rejected by automatic approval review; created the repository privately instead. No public-source permission is inferred from this rejection.
- The initial browser test accidentally reused a sibling app on port 3100. Those captures were replaced; ShipPack tests now require their own server on 4317 and fail if occupied.
- Installed Neon guidance was read and then removed from the app distribution. Third-party agent authoring examples are not shipped application files and caused the source scan to report sample domains.
- Paid generation uses a database lease to prevent concurrent duplicate model calls. A stale lease can be retried after 90 seconds.
