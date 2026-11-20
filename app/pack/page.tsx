import { Suspense } from "react";
import { Workspace } from "../../components/workspace";
import { paymentsReady } from "../../lib/http";
export default function Page() {
  return (
    <main id="main" className="wrap">
      <Suspense fallback={<p>Opening your workspace…</p>}>
        <Workspace payments={paymentsReady()} />
      </Suspense>
    </main>
  );
}
