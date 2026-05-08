"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

export default function Sidebar() {
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
    <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-950/95 px-6 py-8 text-slate-100 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="flex h-full flex-col justify-between gap-10">
        <div className="space-y-8">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                Hotel AI
              </p>
              <p className="text-xs text-slate-500">
                Hospitality command center
              </p>
            </div>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-slate-900 text-white shadow-lg shadow-sky-500/20"
                    : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-300 shadow-inner shadow-slate-950/10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Quick links
            </p>
            <ul className="mt-4 space-y-3 leading-7">
              <li>Guest check-in</li>
              <li>Room service</li>
              <li>Local recommendations</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 rounded-[32px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/10">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
              G
            </div>
            <div>
              <p className="font-semibold text-white">Guest</p>
              <p className="text-xs text-slate-500">Front desk preview</p>
            </div>
          </div>
          {/* <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-12 w-full items-center justify-center rounded-3xl border border-white/10 bg-slate-950/90 text-sm text-slate-200 transition hover:bg-slate-900"
          >
            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </button> */}
        </div>
      </div>
    </aside>
  );
}
