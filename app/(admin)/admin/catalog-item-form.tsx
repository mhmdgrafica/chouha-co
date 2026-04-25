"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CatalogItemFormProps = {
  endpoint: "/api/admin/brands" | "/api/admin/categories";
  title: string;
  description: string;
  submitLabel: string;
};

export function CatalogItemForm({
  endpoint,
  title,
  description,
  submitLabel,
}: CatalogItemFormProps) {
  const router = useRouter();
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameEn,
          nameAr,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save item.");
      }

      setNameEn("");
      setNameAr("");
      router.refresh();
      setMessage({
        type: "success",
        text: "Saved successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to save item.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-slate-600">
            Name (EN)
          </label>
          <input
            type="text"
            value={nameEn}
            onChange={(event) => setNameEn(event.target.value)}
            placeholder="Pilot"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-right text-sm font-medium text-slate-600">
            الاسم (AR)
          </label>
          <input
            dir="rtl"
            type="text"
            value={nameAr}
            onChange={(event) => setNameAr(event.target.value)}
            placeholder="بايلوت"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
