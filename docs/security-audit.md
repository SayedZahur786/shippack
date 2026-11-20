# ShipPack security self-audit

Reviewer: implementation agent. Date: 21 November 2026. Based on the unmodified shared launch-kit security checklist. This is not an independent penetration test or legal review.

| Checklist item | Result and evidence |
| --- | --- |
| Protected route inventory | PASS for current preview: /api/pack, /api/export, /api/checkout require an owned, unexpired pack. Random 256-bit bearer token is hashed in Neon; cookie is HttpOnly, SameSite=Lax, Secure in production. Direct signed-out export denial tested. No accounts or roles. Full paid ownership matrix remains unverified without payment credentials. |
| Input, uploads, SQL | PASS: allowlisted github.com owner/repo URLs; server fetches api.github.com only, redirects rejected. ZIP ≤3 MB, ≤12 MB declared expanded size, ≤1500 entries, ≤300 KB per file, no disk extraction. Traversal and expansion unit tests pass. Request body streaming cap added. SQL is parameterized and migrations versioned. |
| Secrets | PASS: Gitleaks scanned authored files with secrets redacted; local env, dependencies, generated build, agent tooling excluded from distribution. Git history scan recorded at release. No credentials are in browser source. No user inputs are logged by app code. |
| Rate limits and costs | PARTIAL: atomic Neon shared limits, fail closed on database failure, global analysis cap 30/hour, per-pack checkout/generation cap 30/hour. Global cap trades availability for strict GitHub cost control and ignores spoofable client IP headers. Provider limits still apply. Live LLM concurrency, rate-limit failure injection and paid retries need credential-backed testing before paid launch. |
| Sessions and CSRF | PASS for preview: exact same-origin check on POSTs; seven-day token expiry and database ownership checks; no third-party CORS. Checkout redirect comes from Stripe server API. Lost cookie cannot be recovered through a public route. Revocation occurs by deleting the pack row. |
| HTTPS security headers | Shared nonce CSP, nosniff, referrer policy, permissions and one-year HSTS. Run results in LAUNCH.md. Dynamic rendering ensures matching per-request script nonce. |
| Dependencies | npm audit: zero vulnerabilities on installed dependency tree. Lockfile committed. Frozen install is required. |
| Gates and policies | Run results in LAUNCH.md. Analytics consent remains false. Contact is the maintainer’s real GitHub profile; private support/refund contact should be established before accepting purchases. Expired database records are removed lazily on the next analysis, disclosed in privacy policy. |
| Errors, recovery, accessibility | Desktop/mobile route and interaction tests pass. Error responses are sanitized, React escapes source-derived text, error boundaries allow retry. Keyboard labels, visible focus and skip link included. Not a full WCAG audit. |

## Paid launch is blocked

The app does not enable checkout without both Stripe and OpenAI credentials. No live charge, refund, model generation or paid-user export was tested. Webhooks are deliberately absent: the browser asks the server to retrieve the stored Stripe checkout session, and the server checks amount, currency, payment state and pack binding. This avoids a webhook replay surface but requires the buyer to return and verify payment. Refund handling is manual. Establish a private support channel and exercise Stripe test-mode success, cancellation, failure and retry before switching to live keys.

## Operational recovery

Neon project young-dust-61719572 is isolated from other app data; production branch br-snowy-bar-aoxfa286. The project’s reported restore history is six hours. Recovery can branch from a retained point in time; no restore drill has been performed. The initial app connection is the provisioned owner role, so least-privilege role separation is an outstanding paid-launch hardening item. Never copy local environment files into Git or a browser.
