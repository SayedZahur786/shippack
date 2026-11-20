# Decisions

- 2026-11-21: Work exclusively in shippack; parent ignore already excludes all project folders. Standalone Git initialized before implementation.
- Use public GitHub repositories and ZIPs only; no access to private hosting credentials in v1.
- Browser owns one pack via a random bearer cookie, stored hashed in Neon. No accounts or team feature.
- Model and payments fail closed when credentials are absent. A clearly labeled built-in sample remains usable locally, including export.
- Record a real Playwright walkthrough with macOS speech narration and large captions. This demonstrates actual controls and avoids implying an unverified hosted purchase. The user explicitly selected Playwright as an allowed video framework; no HyperFrames composition needed.
- GitHub CLI reported invalid authentication; publication requires renewed login unless a permitted authenticated retry succeeds.
- Analytics kit component is included with consent false. Operational counts come from expiring database records; no tracking SDK.
