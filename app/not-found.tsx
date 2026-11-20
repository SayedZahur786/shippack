import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="policy">
      <p className="eyebrow">404 · page not found</p>
      <h1>This file missed the pack.</h1>
      <p>
        The page may have moved. Your next submission starts at the workspace.
      </p>
      <Link className="btn" href="/pack">
        Open workspace
      </Link>
    </main>
  );
}
