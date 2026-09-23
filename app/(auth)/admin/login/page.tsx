"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    router.replace(searchParams.get("next") || "/admin");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">Chouha Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to manage the catalog.</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500" />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Password
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500" />
          </label>
        </div>

        {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
