"use client";

import type { ProductFormValues } from "./product-form.types";

type Props = {
  form: ProductFormValues;
  updateField: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => void;
};

export function ProductBasicInfo({ form, updateField }: Props) {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Basic Information
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-600">
            Product Name (EN)
          </label>
          <input
            type="text"
            value={form.productNameEn}
            onChange={(e) => updateField("productNameEn", e.target.value)}
            placeholder="V Board Master Whiteboard Marker"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-right text-sm font-medium text-slate-600 block">
            اسم المنتج (AR)
          </label>
          <input
            dir="rtl"
            type="text"
            value={form.productNameAr}
            onChange={(e) => updateField("productNameAr", e.target.value)}
            placeholder="قلم سبورة قابل لإعادة التعبئة"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">
            Product Code
          </label>
          <input
            type="text"
            value={form.productCode}
            onChange={(e) => updateField("productCode", e.target.value)}
            placeholder="660103"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">
            Brand
          </label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => updateField("brand", e.target.value)}
            placeholder="Pilot"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-600">
            Category
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            placeholder="Markers"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">
            Short Description (EN)
          </label>
          <input
            type="text"
            value={form.shortDescriptionEn}
            onChange={(e) => updateField("shortDescriptionEn", e.target.value)}
            placeholder="Short product description"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-right text-sm font-medium text-slate-600">
            الوصف المختصر (AR)
          </label>
          <input
            dir="rtl"
            type="text"
            value={form.shortDescriptionAr}
            onChange={(e) => updateField("shortDescriptionAr", e.target.value)}
            placeholder="وصف مختصر للمنتج"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">
            Full Description (EN)
          </label>
          <textarea
            value={form.fullDescriptionEn}
            onChange={(e) => updateField("fullDescriptionEn", e.target.value)}
            rows={5}
            placeholder="Full product description..."
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-right text-sm font-medium text-slate-600">
            الوصف الكامل (AR)
          </label>
          <textarea
            dir="rtl"
            value={form.fullDescriptionAr}
            onChange={(e) => updateField("fullDescriptionAr", e.target.value)}
            rows={5}
            placeholder="الوصف الكامل للمنتج..."
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>
    </div>
  );
}