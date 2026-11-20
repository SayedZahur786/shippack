const text =
  "# Terms of use\n\nEffective date: 21 November 2026\n\n## Service and agreement\nShipPack prepares hackathon submission drafts from repository evidence. By using it you agree to these terms. The free checklist and labeled sample are available without payment. Generated writing is a draft requiring your review, not a promise of eligibility, prizes, accuracy or acceptance.\n\n## Eligibility and accounts\nUse this service only when you can lawfully agree to these terms, with guardian permission if required. No team accounts are offered. A browser cookie controls access to your pack, and losing it may prevent access. You are responsible for protecting your device and downloading your work before expiry.\n\n## Acceptable use\nUpload only source you own or have permission to process. Do not upload secrets, malware, sensitive personal data or prohibited content. Do not attempt to bypass payment, exhaust shared resources, access another person\u2019s pack or misrepresent generated content as verified results. Repository code is inspected as data and never executed.\n\n## Content and intellectual property\nYou retain rights to your submitted code and grant only the permission needed to analyze it and prepare your requested documents. Review license obligations for dependencies and third-party material. AI-assisted output may not be unique and can contain errors. You are responsible for truthful claims, attribution and compliance with your hackathon\u2019s AI and submission rules.\n\n## Payment and cancellation\nA full pack costs USD 5 per checkout when paid generation is enabled. The application does not accept payment before its required services are configured. Stripe presents the final checkout amount. Generation begins after verified payment. Failed generation can be retried without a second purchase. If delivery fails, contact the maintainer to request resolution or a refund; statutory consumer rights remain unaffected. There is no subscription to cancel.\n\n## Availability, responsibility and disputes\nThe service is an early release and may be interrupted. Back up downloaded files and submit through the hackathon platform yourself. We do not submit to Devpost or guarantee that a draft satisfies event rules. To the extent permitted by applicable law, the service is provided without warranties and liability is limited to fees paid for the affected pack. Nothing excludes non-excludable rights. Contact the maintainer first to seek an informal resolution; applicable law governs unresolved disputes.\n\n## Termination and changes\nWe may restrict abusive use or suspend generation during outages. Packs expire seven days after creation. Pricing or terms may change for future purchases; completed purchases retain their stated price. Updates appear on this page with a revised effective date.\n\n## Contact\nShipPack is a project maintained by Sayed Zahur. For support, privacy or deletion requests, contact the maintainer through https://github.com/SayedZahur786. Do not publish private source or access tokens in a public issue.\n";
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
