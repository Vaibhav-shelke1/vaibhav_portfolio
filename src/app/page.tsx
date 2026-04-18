"use client";

import { useState, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import IDELayout from "@/components/IDELayout";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <>
      <LoadingScreen onDone={handleDone} />
      {loaded && <IDELayout />}
    </>
  );
}
