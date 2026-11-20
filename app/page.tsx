import Link from "next/link";
export default function Home() {
  return (
    <main id="main">
      <div className="wrap">
        <section className="hero">
          <div>
            <p className="eyebrow">For the final stretch of your hackathon</p>
            <h1>
              You built the thing.
              <br />
              <em>Now ship the story.</em>
            </h1>
            <p className="lede">
              Turn your repo into a submission judges can follow. A clear
              README, Devpost story, and demo script — all in one pack.
            </p>
            <div className="actions">
              <Link className="btn lime" href="/pack">
                Get your free checklist
              </Link>
              <Link className="btn light" href="/pack?sample=1">
                Explore a sample
              </Link>
            </div>
            <p className="micro">
              Free checklist. Full pack $5 when paid generation opens. No
              subscription.
            </p>
          </div>
          <div className="preview">
            <div className="file-window">
              <div className="window-bar">
                <span>◈ &nbsp; campusplate / submission</span>
                <span>Sample pack</span>
              </div>
              <div className="sample-body">
                <span className="pill">FROM CODE TO CLEAR STORY</span>
                <h3>CampusPlate</h3>
                <p className="micro">A campus surplus-food prototype.</p>
                <div className="actions">
                  <span className="pill">Next.js</span>
                  <span className="pill">TypeScript</span>
                  <span className="pill">Neon</span>
                </div>
                {[
                  ["README.md", "Your project, explained"],
                  ["devpost.md", "A judge-readable story"],
                  ["demo-script.md", "A two-minute walkthrough"],
                  ["checklist.md", "The final sanity check"],
                ].map(([a, b]) => (
                  <div className="file-row" key={a}>
                    <div>
                      <b>{a}</b>
                      <br />
                      <span className="micro">{b}</span>
                    </div>
                    <span className="check">✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <div className="strip">
          <span>◈ &nbsp; Public GitHub repo or ZIP</span>
          <span>✓ &nbsp; Claims grounded in source evidence</span>
          <span>↓ &nbsp; Four files. One download.</span>
        </div>
        <section className="section">
          <p className="eyebrow">The work is done. Make it understood.</p>
          <h2>
            Less blank-page panic.
            <br />
            More time for one last rehearsal.
          </h2>
          <div className="cards">
            {[
              [
                "⌘",
                "Start with what you built",
                "We inspect your file tree and dependencies, and show the code behind each detected capability.",
              ],
              [
                "▤",
                "Give judges a clear path",
                "Problem, solution, demo, tech. Your free checklist puts the important parts in one place.",
              ],
              [
                "↳",
                "Leave with the whole pack",
                "Review your README, Devpost text and timed demo script. Export Markdown files together.",
              ],
            ].map(([i, h, p]) => (
              <article className="card" key={h}>
                <span className="icon">{i}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="price">
          <div>
            <p className="eyebrow">One project. One submission pack.</p>
            <h2>A small finish for a big weekend.</h2>
            <p>
              The checklist is free. Paid generation opens once service setup is
              complete.
            </p>
          </div>
          <div>
            <strong>$5</strong>
            <span> / pack</span>
            <div className="actions">
              <Link className="btn lime" href="/pack">
                Start with the free checklist
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
