# ShipPack security self-audit

Reviewer: implementation agent. Date: 21 November 2026. Based on the unmodified shared launch-kit security checklist. This is not an independent penetration test or legal review.

| Checklist item | Result and evidence |
| --- | --- |
| Protected route inventory | PASS for current preview: /api/pack, /api/export, /api/checkout require an owned, unexpired pack. Random 256-bit bearer token is hashed in Neon; cookie is HttpOnly, SameSite=Lax, Secure in production. Direct signed-out export denial tested. No accounts or roles. Full paid ownership matrix remains unverified without payment credentials. |
| Input, uploads, SQL | PASS: allowlisted github.com owner/repo URLs; server fetches api.github.com only, redirects rejected. ZIP ≤3 MB, ≤12 MB declared expanded size, ≤1500 entries, ≤300 KB per file, no disk extraction. Traversal and expansion unit tests pass. Request body streaming cap added. SQL is parameterized and migrations versioned. |
| Secrets | PASS: Gitleaks scanned authored files with secrets redacted; local env, dependencies, generated build, agent tooling excluded from distribution. Git history scan also passed at release. No credentials are in browser source. No user inputs are logged by app code. |
| Rate limits and costs | PASS for preview: atomic Neon shared limits tested with 31 simultaneous calls (30 accepted, one denied); missing database configuration fails closed, global analysis cap 30/hour, per-pack checkout/generation cap 30/hour. Global cap trades availability for strict GitHub cost control and ignores spoofable client IP headers. Provider limits still apply. A database lease now prevents concurrent model calls; stale leases expire after 90 seconds. Live LLM and paid retry validation still require credentials. |
| Sessions and CSRF | PASS for preview: exact same-origin check on POSTs; seven-day token expiry and database ownership checks; no third-party CORS. Checkout redirect comes from Stripe server API. Lost cookie cannot be recovered through a public route. Revocation occurs by deleting the pack row. |
| HTTPS security headers | Shared nonce CSP, nosniff, referrer policy, permissions and one-year HSTS. Run results in LAUNCH.md. Dynamic rendering ensures matching per-request script nonce. |
| Dependencies | npm audit: zero vulnerabilities on installed dependency tree. Lockfile committed. Frozen install is required. |
| Gates and policies | Run results in LAUNCH.md. Analytics consent remains false. Contact is the maintainer’s real GitHub profile; private support/refund contact should be established before accepting purchases. Expired database records are removed lazily on the next analysis, disclosed in privacy policy. |
| Errors, recovery, accessibility | Desktop/mobile route and interaction tests pass. Error responses are sanitized, React escapes source-derived text, error boundaries allow retry. Keyboard labels, visible focus and skip link included. Not a full WCAG audit. |

## Paid launch is blocked

The app does not enable checkout without both Stripe and OpenAI credentials. No live charge, refund, model generation or paid-user export was tested. Webhooks are deliberately absent: the browser asks the server to retrieve the stored Stripe checkout session, and the server checks amount, currency, payment state and pack binding. This avoids a webhook replay surface but requires the buyer to return and verify payment. Refund handling is manual. Establish a private support channel and exercise Stripe test-mode success, cancellation, failure and retry before switching to live keys.

## Operational recovery

Neon project young-dust-61719572 is isolated from other app data; production branch br-snowy-bar-aoxfa286. The project’s reported restore history is six hours. Recovery can branch from a retained point in time; no restore drill has been performed. The app now uses shippack_app with only CONNECT, schema USAGE and SELECT/INSERT/UPDATE/DELETE on its two tables. Migration owner access remains local and is not deployed. Never copy local environment files into Git or a browser.

## Additional release evidence

The restricted database role reports CREATE on public schema = false, and required table privileges = true. scripts/security-smoke.ts directly exercises the shared limiter. Hosted public repository analysis and persisted reload passed on Vercel. Paid-flow validation remains blocked on credentials.
