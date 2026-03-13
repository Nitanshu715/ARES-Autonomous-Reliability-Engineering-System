import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARES — Autonomous Reliability Engineering System",
  description: "Cloud microservices reliability platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}