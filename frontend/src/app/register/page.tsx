"use client";

import Link from "next/link";
import { useState } from "react";
import Toast from "@/components/Toast";

interface RegisterState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialState: RegisterState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Password is required.";
    else if (form.password.length < 8)
      nextErrors.password = "Password should be at least 8 characters.";
    if (!form.confirmPassword)
      nextErrors.confirmPassword = "Confirm your password.";
    else if (form.password !== form.confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match.";
    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setToastType("error");
      setToastMessage("Please fix the errors before continuing.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setToastType("success");
      setToastMessage("Account created successfully. Redirecting to login...");
      setForm(initialState);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-hero-pattern bg-cover bg-center px-6 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-[34px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200 shadow-sm shadow-cyan-500/20">
              New member
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Create your Hotel AI account
              </h1>
              <p className="max-w-xl text-slate-300 leading-7">
                Join the smart hospitality platform for premium guest
                experiences, intelligent automation, and secure hotel
                operations.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Fast setup
                </p>
                <p className="text-2xl font-semibold text-white">
                  Ready in minutes
                </p>
              </div>
              <div className="space-y-1 rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Secure
                </p>
                <p className="text-2xl font-semibold text-white">
                  Encrypted access
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Create account
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Register now
                </h2>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
                Guest profile
              </div>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Full name
                </span>
                <input
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({ ...form, fullName: event.target.value })
                  }
                  type="text"
                  placeholder="Alex Taylor"
                  className={`input-field ${errors.fullName ? "input-error" : ""}`}
                />
                {errors.fullName ? (
                  <p className="mt-2 text-sm text-rose-300">
                    {errors.fullName}
                  </p>
                ) : null}
              </label>
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
                  placeholder="Create a password"
                  className={`input-field ${errors.password ? "input-error" : ""}`}
                />
                {errors.password ? (
                  <p className="mt-2 text-sm text-rose-300">
                    {errors.password}
                  </p>
                ) : null}
              </label>
              <label className="group block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm password
                </span>
                <input
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm({ ...form, confirmPassword: event.target.value })
                  }
                  type="password"
                  placeholder="Repeat password"
                  className={`input-field ${errors.confirmPassword ? "input-error" : ""}`}
                />
                {errors.confirmPassword ? (
                  <p className="mt-2 text-sm text-rose-300">
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="primary-btn w-full justify-center"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-sky-300 hover:text-cyan-200"
              >
                Sign in
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
