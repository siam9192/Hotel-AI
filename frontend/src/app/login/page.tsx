"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

const initialState: FormState = {
  email: "",
  password: "",
  remember: false,
};

export default function LoginPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("hotel-ai-login");
    if (stored) {
      setForm((prev) => ({
        ...prev,
        email: JSON.parse(stored).email ?? prev.email,
      }));
    }
  }, []);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Password is required.";
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setToastType("error");
      setToastMessage("Please correct the highlighted fields.");
      return;
    }

    setSubmitting(true);
    window.localStorage.setItem(
      "hotel-ai-login",
      JSON.stringify({ email: form.email }),
    );

    setTimeout(() => {
      setSubmitting(false);
      setToastType("success");
      setToastMessage("Welcome back! Login successful.");
    }, 900);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-hero-pattern bg-cover bg-center px-6 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-[34px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200 shadow-sm shadow-cyan-500/20">
              Concierge access
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Sign in to Hotel AI
              </h1>
              <p className="max-w-xl text-slate-300 leading-7">
                Enter your credentials to unlock the intelligent guest
                experience, bookings overview, and AI concierge chat.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Trusted by
                </p>
                <p className="text-2xl font-semibold text-white">
                  Luxury teams
                </p>
              </div>
              <div className="space-y-1 rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Resolved
                </p>
                <p className="text-2xl font-semibold text-white">
                  Guest requests fast
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Secure login
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Welcome back
                </h2>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
                AI Concierge
              </div>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </span>
                <input
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  type="email"
                  placeholder="you@hotelai.com"
                  className={`input-field ${errors.email ? "input-error" : ""}`}
                />
                {errors.email ? (
                  <p className="mt-2 text-sm text-rose-300">{errors.email}</p>
                ) : null}
              </label>
              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </span>
                <input
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  type="password"
                  placeholder="Enter password"
                  className={`input-field ${errors.password ? "input-error" : ""}`}
                />
                {errors.password ? (
                  <p className="mt-2 text-sm text-rose-300">
                    {errors.password}
                  </p>
                ) : null}
              </label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(event) =>
                      setForm({ ...form, remember: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-400"
                  />
                  Remember me
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-sky-300 transition hover:text-cyan-200"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="primary-btn w-full justify-center"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
              New to Hotel AI?{" "}
              <Link
                href="/register"
                className="font-semibold text-sky-300 hover:text-cyan-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {toastMessage ? (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      ) : null}
    </div>
  );
}
