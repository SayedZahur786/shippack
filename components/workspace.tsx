"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sample, samplePack, type Analysis, type Pack } from "../lib/analyze";
import { packZip } from "../lib/zip";
export function Workspace({ payments }: { payments: boolean }) {
  const params = useSearchParams();
  const [isSample, setIsSample] = useState(params.get("sample") === "1");
  const [analysis, setAnalysis] = useState<Analysis | null>(
      isSample ? sample : null,
    ),
    [content, setContent] = useState<Pack | null>(isSample ? samplePack : null),
    [tab, setTab] = useState<keyof Pack>("checklist"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [url, setUrl] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    if (isSample) return;
    fetch("/api/pack")
      .then((r) => r.json())
      .then((p) => {
        if (p.analysis) {
          setAnalysis(p.analysis);
          setContent(p.content);
        }
      })
      .catch(() => {});
  }, [isSample]);
  async function call(path: string, options: RequestInit) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(path, options);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please retry.");
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function submit(file?: File) {
    const body = file ? new FormData() : JSON.stringify({ url });
    if (body instanceof FormData) body.set("file", file!);
    const p = await call("/api/analyze", {
      method: "POST",
      body,
      headers: file ? undefined : { "Content-Type": "application/json" },
    });
    if (p) {
      setIsSample(false);
      setAnalysis(p.analysis);
      setContent(null);
      setTab("checklist");
      history.replaceState(null, "", "/pack");
    }
  }
  async function checkout() {
    const p = await call("/api/checkout", { method: "POST" });
    if (p?.url) location.assign(p.url);
  }
  async function finish() {
    const p = await call("/api/pack", { method: "POST" });
    if (p) {
      setContent(p.content);
      setTab("devpost");
    }
  }
  function download() {
    if (isSample && content) {
      const object = URL.createObjectURL(
        new Blob([new Uint8Array(packZip(content))], {
          type: "application/zip",
        }),
      );
      const a = document.createElement("a");
      a.href = object;
      a.download = "campusplate-sample.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(object), 1000);
    } else {
      const link = document.createElement("a");
      link.href = "/api/export";
      link.click();
    }
  }
  return (
    <div className="workspace">
      <p className="eyebrow">Your submission, assembled</p>
      <h1>Give your build a better finish.</h1>
      <p className="lede">Start with the repo. Leave with a story.</p>
      {isSample && (
        <p className="notice">
          Sample preview · CampusPlate is a fictional demonstration repository.
          This pack is free to explore and export.
        </p>
      )}
      <div className="workgrid">
        <aside>
          <div className="panel">
            <h2>Bring your project</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <label htmlFor="repo">Public GitHub repository</label>
              <input
                id="repo"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
              />
              <button className="btn lime" disabled={busy}>
                {busy ? "Analyzing your project…" : "Build free checklist"}
              </button>
            </form>
            <p className="micro">Or upload your source code</p>
            <label htmlFor="zip">ZIP archive · up to 3 MB</label>
            <input
              id="zip"
              type="file"
              accept=".zip"
              disabled={busy}
              onChange={(e) => {
                if (e.target.files?.[0]) void submit(e.target.files[0]);
              }}
            />
            <p className="micro">
              Source is never executed. Remove secrets before upload. Public
              repositories only.
            </p>
          </div>
          <div className="panel mt-5">
            <h2>Your full submission pack</h2>
            <p className="micro">
              README, Devpost text, demo script, and checklist. One ZIP. $5,
              once.
            </p>
            {!payments ? (
              <p className="notice mt-4">
                Paid generation is not open yet. Explore the sample while
                service setup is completed.
              </p>
            ) : (
              <>
                <button
                  className="btn"
                  disabled={busy || !analysis || isSample}
                  onClick={checkout}
                >
                  Unlock full pack · $5
                </button>
                <button
                  className="btn light"
                  disabled={busy || !analysis || isSample}
                  onClick={finish}
                >
                  Verify payment & generate
                </button>
              </>
            )}
            <a className="btn light" href="/pack?sample=1">
              Explore sample pack
            </a>
          </div>
        </aside>
        <section className="panel" aria-live="polite">
          {error && (
            <p className="notice error mb-5" role="alert">
              {error}
            </p>
          )}
          {analysis ? (
            <>
              <div className="flex justify-between gap-3 flex-wrap">
                <div>
                  <p className="eyebrow">
                    {isSample ? "SAMPLE PROJECT" : "REPOSITORY ANALYZED"}
                  </p>
                  <h2>{analysis.name}</h2>
                </div>
                <span className="micro">
                  {analysis.files} source files inspected
                </span>
              </div>
              <div className="flex gap-2 flex-wrap mb-6">
                {analysis.stack.map((s) => (
                  <span className="pill" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="tabs" role="tablist" aria-label="Pack documents">
                {(["checklist", "readme", "devpost", "script"] as const).map(
                  (t) => (
                    <button
                      role="tab"
                      aria-selected={tab === t}
                      className={`tab ${tab === t ? "active" : ""}`}
                      key={t}
                      onClick={() => setTab(t)}
                    >
                      {
                        {
                          checklist: "Checklist",
                          readme: "README",
                          devpost: "Devpost",
                          script: "Demo script",
                        }[t]
                      }
                      {t !== "checklist" && !content ? " · $5" : ""}
                    </button>
                  ),
                )}
              </div>
              {tab === "checklist" ? (
                <div>
                  {analysis.checklist.map((c) => (
                    <label className="checkitem" key={c.title}>
                      <input type="checkbox" />
                      <span>
                        <strong>{c.title}</strong>
                        <p>{c.detail}</p>
                      </span>
                    </label>
                  ))}
                  <details className="mt-5">
                    <summary>View source evidence</summary>
                    {analysis.features.map((f, i) => (
                      <p className="micro mt-3" key={i}>
                        {f.label} · {f.path}
                      </p>
                    ))}
                  </details>
                </div>
              ) : content ? (
                <pre className="document">{content[tab]}</pre>
              ) : (
                <div className="empty">
                  <h2>Your story goes here.</h2>
                  <p>Full documents unlock after a verified $5 purchase.</p>
                  <p className="micro">
                    The free checklist above is ready now.
                  </p>
                </div>
              )}
              {content && (
                <div className="actions">
                  <button className="btn lime" onClick={download}>
                    Download pack ZIP
                  </button>
                  <button
                    className="btn light"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(content[tab]);
                        setNotice("Copied to clipboard.");
                      } catch {
                        setNotice(
                          "Clipboard unavailable. Select and copy the document text.",
                        );
                      }
                    }}
                  >
                    Copy {tab}
                  </button>
                </div>
              )}
              {notice && (
                <p className="micro" role="status">
                  {notice}
                </p>
              )}
            </>
          ) : (
            <div className="empty">
              <div className="icon">▤</div>
              <h2>Your next great submission starts here.</h2>
              <p>
                Paste a public repository URL or choose a ZIP.
                <br />
                We’ll find your stack and fill a judge-focused checklist.
              </p>
              <a className="btn light mt-6" href="/pack?sample=1">
                See a finished sample
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
