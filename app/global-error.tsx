"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <h1>ShipPack could not open.</h1>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
