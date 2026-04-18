"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import GitHubContributions from "@/components/GitHubContributions";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Terminal from "@/components/Terminal";

const SECTIONS = [
  { id: "about",        label: "/about",        number: "01" },
  { id: "skills",       label: "/skills",        number: "02" },
  { id: "experience",   label: "/experience",    number: "03" },
  { id: "github",       label: "/github",        number: "04" },
  { id: "projects",     label: "/projects",      number: "05" },
  { id: "achievements", label: "/achievements",  number: "06" },
  { id: "contact",      label: "/contact",       number: "07" },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [flashing, setFlashing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleDone = useCallback(() => setLoaded(true), []);

  // Navigate to a section with a brief glitch flash
  const navigateTo = useCallback((id: string) => {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 350);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // IntersectionObserver — track which section is in view
  useEffect(() => {
    if (!loaded) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4, root: container }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loaded]);

  // Keyboard navigation — arrow keys jump between sections
  useEffect(() => {
    if (!loaded) return;
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const idx = SECTIONS.findIndex((s) => s.id === activeSection);

      if ((e.key === "ArrowDown" || e.key === "PageDown") && idx < SECTIONS.length - 1) {
        e.preventDefault();
        navigateTo(SECTIONS[idx + 1].id);
      }
      if ((e.key === "ArrowUp" || e.key === "PageUp") && idx > 0) {
        e.preventDefault();
        navigateTo(SECTIONS[idx - 1].id);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loaded, activeSection, navigateTo]);

  return (
    <>
      <LoadingScreen onDone={handleDone} />

      {loaded && (
        <>
          {/* Top bar — logo + mobile nav */}
          <Navbar sections={SECTIONS} activeSection={activeSection} onNavigate={navigateTo} />

          {/* Desktop side HUD */}
          <SideNav sections={SECTIONS} activeSection={activeSection} onNavigate={navigateTo} />

          {/* Glitch flash overlay on navigation */}
          {flashing && (
            <div
              className="fixed inset-0 z-40 pointer-events-none level-flash"
              style={{
                background:
                  "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,0.015) 2px,rgba(0,255,136,0.015) 4px)",
              }}
            />
          )}

          {/* Snap container — each direct-child section snaps to fill the screen */}
          <div ref={containerRef} className="snap-container">
            <Hero onNavigate={navigateTo} />
            <Skills />
            <Experience />
            <GitHubContributions />
            <Projects />
            <Achievements />
            <Contact />
          </div>

          <Terminal />
        </>
      )}
    </>
  );
}
