import type { Metadata, Viewport } from "next";
import SwRegister from "./SwRegister";

export const metadata: Metadata = {
  title: "Admin · Vaibhav",
  description: "Personal admin dashboard",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Admin",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#010409",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SwRegister />
      {children}
    </>
  );
}
