"use client";
import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw-admin.js").catch(() => {});
    }
  }, []);
  return null;
}
