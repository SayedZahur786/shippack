"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="policy">
      <h1>That didn’t finish.</h1>
      <p>
        Please retry. If payment completed, verify it again before making
        another purchase.
      </p>
      <button className="btn" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
