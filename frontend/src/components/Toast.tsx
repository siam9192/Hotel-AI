"use client";

import { useEffect } from "react";

interface ToastProps {
  type?: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Toast({
  type = "success",
  message,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`toast ${type === "error" ? "toast-error" : "toast-success"}`}
    >
      <p>{message}</p>
    </div>
  );
}
