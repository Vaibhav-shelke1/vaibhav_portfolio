import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaibhav Shelke | Full Stack Developer",
  description: "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript. Building production-grade applications.",
  keywords: ["Vaibhav Shelke", "Full Stack Developer", "React", "Next.js", "Node.js", "TypeScript"],
  authors: [{ name: "Vaibhav Shelke" }],
  openGraph: {
    title: "Vaibhav Shelke | Full Stack Developer",
    description: "Production-grade Full Stack Developer. 50K+ API requests/day. 99.9% uptime.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg antialiased">{children}</body>
    </html>
  );
}
