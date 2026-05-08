"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("hotel-ai-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme =
      storedTheme === "dark" || (!storedTheme && prefersDark)
        ? "dark"
        : "light";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("hotel-ai-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 text-white transition-all hover:gap-4"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-cyan-500/20">
            <span className="text-lg font-semibold tracking-tight">AI</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
              Hotel AI
            </p>
            <p className="text-sm text-slate-400">Smart hospitality platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-slate-900 text-white shadow-lg shadow-sky-500/20"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 text-slate-200 transition hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <span className="text-xl">☀️</span>
            ) : (
              <span className="text-xl">🌙</span>
            )}
          </button>
          <div className="hidden items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 shadow-xl shadow-slate-950/20 sm:flex">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-semibold text-white">
              G
            </span>
            <div>
              <div className="text-sm font-semibold text-white">Guest</div>
              <div className="text-xs text-slate-500">Front desk preview</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
