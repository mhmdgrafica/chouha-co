"use client";

import type { ProductHighlight } from "./product-form.types";

type Props = {
  highlights: ProductHighlight[];
  onChange: (items: ProductHighlight[]) => void;
};

export function ProductHighlights({ highlights, onChange }: Props) {
  const update = (id: string, key: "textEn" | "textAr", value: string) => {
    onChange(
      highlights.map((h) =>
        h.id === id ? { ...h, [key]: value } : h
      )
    );
  };

  const addHighlight = () => {
    onChange([
      ...highlights,
      { id: crypto.randomUUID(), textEn: "", textAr: "" },
    ]);
  };

  const removeHighlight = (id: string) => {
    onChange(highlights.filter((h) => h.id !== id));
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Highlights
        </h3>

        <button
          type="button"
          onClick={addHighlight}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          + Add
        </button>
      </div>

      <div className="space-y-4">
        {highlights.map((h, index) => (
          <div
            key={h.id}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Highlight {index + 1}
              </p>

              <button
                type="button"
                onClick={() => removeHighlight(h.id)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  English
                </label>
                <input
                  type="text"
                  value={h.textEn}
                  onChange={(e) => update(h.id, "textEn", e.target.value)}
                  placeholder="Highlight text..."
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-right text-sm font-medium text-slate-600">
                  العربية
                </label>
                <input
                  dir="rtl"
                  type="text"
                  value={h.textAr}
                  onChange={(e) => update(h.id, "textAr", e.target.value)}
                  placeholder="نص الميزة..."
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}