"use client";
import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [msg, setMsg] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setMsg("Email address copied. Thank you.");
    } catch {
      setMsg(`Couldn't copy. The address is ${email}.`);
    }
    window.setTimeout(() => setMsg(""), 4000);
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <button type="button" onClick={copy} className="btn !min-h-11 !px-5">
        Copy email
      </button>
      <span role="status" aria-live="polite" className="text-sm">{msg}</span>
    </span>
  );
}
