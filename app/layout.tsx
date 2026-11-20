import { headers } from "next/headers";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Analytics } from "../components/analytics";
import { ErrorBoundary } from "../components/error-boundary";
import "./globals.css";
export const metadata: Metadata = {
  title: "ShipPack — built it? Ship the story.",
  description:
    "Turn your hackathon repository into a judge-ready checklist, README, Devpost submission and demo script.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: { images: ["/og.png"] },
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await headers();
  return (
    <html lang="en">
      <body>
        <Header
          name="ShipPack"
          links={[
            { href: "/pack", label: "Build your pack" },
            { href: "/pack?sample=1", label: "View sample" },
          ]}
        />
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics consent={false} />
        <Footer name="ShipPack" year={2026} />
      </body>
    </html>
  );
}
