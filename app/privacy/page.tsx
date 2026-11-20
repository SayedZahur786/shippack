const text =
  "# Privacy policy\n\nEffective date: 21 November 2026\n\n## Who operates this service\nShipPack is a project maintained by Sayed Zahur. For support, privacy or deletion requests, contact the maintainer through https://github.com/SayedZahur786. Do not publish private source or access tokens in a public issue.\n\n## Information and purpose\nWe accept a public GitHub repository URL or a source ZIP to detect stack and code capabilities. Source content is processed in memory and is not stored as a full archive. We store the resulting analysis, generated documents, payment session identifier and a hash of a random access token to deliver your pack. Never submit credentials, personal data, or code you cannot authorize us to process.\n\n## Cookies and analytics\nAn essential HttpOnly cookie grants access to your current pack for seven days. Starting another pack replaces that browser access. Save your exports first. The shared analytics component is disabled; we do not currently send page-view analytics or use advertising cookies. Operational database counts help assess checklist and purchase completion.\n\n## Service providers and transfers\nVercel hosts the application and Neon stores pack records when configured. GitHub serves public repository metadata. When paid generation is enabled, OpenAI receives the bounded analysis and Stripe handles checkout; ShipPack does not receive card numbers. These providers may process information outside your country under their own policies. The sample preview uses local bundled demonstration data and does not call a model.\n\n## Retention and security\nPack records expire after seven days and become inaccessible immediately on expiry. Expired rows are deleted when the next analysis runs; provider backups may persist under their own retention. Rate-limit windows are cleared during analysis. Hosting providers may retain operational logs independently. We use parameterized database queries, hashed access tokens and restrictive headers. No service can guarantee absolute security.\n\n## Your choices and rights\nYou may choose the sample instead of uploading code, export your documents, or clear your browser cookie to remove local access. Cookie deletion does not erase server records. Request server deletion via the maintainer contact above, identifying your pack without sharing the access cookie publicly. Applicable access, correction and deletion rights depend on your location. We do not sell uploaded source or use it for advertising.\n\n## Changes\nWe will update the effective date when this policy changes. Review this page before a new upload. Material changes to payment or model processing will also be described in the application.\n";
export default function Page() {
  return (
    <main id="main" className="policy">
      {text.split("\n\n").map((p, i) =>
        p.startsWith("# ") ? (
          <h1 key={i}>{p.slice(2)}</h1>
        ) : p.startsWith("## ") ? (
          <section key={i}>
            <h2>{p.split("\n")[0].slice(3)}</h2>
            <p>{p.split("\n").slice(1).join(" ")}</p>
          </section>
        ) : (
          <p key={i}>{p}</p>
        ),
      )}
    </main>
  );
}
