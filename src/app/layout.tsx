import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaibhav Shelke | Full Stack Developer",
  description: "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript. Building production-grade applications.",
  keywords: ["Vaibhav Shelke", "Full Stack Developer", "React", "Next.js", "Node.js", "TypeScript"],
  authors: [{ name: "Vaibhav Shelke" }],
  openGraph: {
    title: "Vaibhav Shelke | Full Stack Developer",
    description: "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </head>
      <body className="bg-bg antialiased">{children}</body>
    </html>
  );
}
