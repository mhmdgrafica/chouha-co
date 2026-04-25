"use client";

import type { ProductColorOption, ProductFormValues } from "./product-form.types";
import { featureIconLabels } from "./product-form.constants";

type Props = {
  form: ProductFormValues;
  selectedColor: ProductColorOption | null;
};

export function ProductLivePreview({ form, selectedColor }: Props) {
  const activeHighlights = form.highlights.filter(
    (item) => item.textEn.trim() !== "" || item.textAr.trim() !== ""
  );

  const activeFeatures = form.featureIcons.filter((item) => item.selected);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="text-sm font-semibold text-slate-900">Live Preview</p>
        <p className="mt-1 text-xs text-slate-500">
          This is a visual preview of how the product can appear in both languages.
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-[24px] border border-slate-200 bg-[#f8f6f0] p-6">
          <div className="flex aspect-[4/3] items-center justify-center rounded-[20px] bg-white text-center">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {selectedColor?.nameEn ||
                  form.productNameEn ||
                  form.productNameAr ||
                  "Product Image"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Main image switches by selected color
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((dot) => (
              <span
                key={dot}
                className={`h-2.5 w-2.5 rounded-full ${
                  dot === 1 ? "bg-slate-900" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 p-5">
            <div className="border-b border-slate-100 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                English Preview
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
                {form.productNameEn || "Product name will appear here"}
              </h2>

              <p className="text-sm font-medium text-slate-500">
                {form.shortDescriptionEn || "Short product description"}
              </p>

              <p className="text-sm text-slate-500">
                Product code: {selectedColor?.productCode || form.productCode || "—"}
              </p>
            </div>

            <div className="space-y-3">
              {activeHighlights.length > 0 ? (
                activeHighlights.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-6 text-slate-700">
                      {item.textEn || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No highlights yet.</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                Ink Colour{" "}
                <span className="font-normal text-slate-500">
                  {selectedColor?.nameEn || "—"}
                </span>
              </p>

              <div className="flex flex-wrap gap-3">
                {form.colors.map((color) => (
                  <div
                    key={color.id}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div
                      className="h-12 w-12 rounded-full border-2 border-white shadow ring-1 ring-slate-300"
                      style={{ backgroundColor: color.hex || "#ddd" }}
                    />
                    <span className="text-xs text-slate-500">
                      {color.nameEn || "Colour"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 p-4">
              <p className="text-sm font-medium text-slate-700">Full Description</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {form.fullDescriptionEn ||
                  "Full product description will appear here."}
              </p>
            </div>
          </div>

          <div
            dir="rtl"
            className="space-y-4 rounded-3xl border border-slate-200 p-5 text-right"
          >
            <div className="border-b border-slate-100 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Arabic Preview
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
                {form.productNameAr || "اسم المنتج سيظهر هنا"}
              </h2>

              <p className="text-sm font-medium text-slate-500">
                {form.shortDescriptionAr || "الوصف المختصر سيظهر هنا"}
              </p>

              <p className="text-sm text-slate-500">
                كود المنتج: {selectedColor?.productCode || form.productCode || "—"}
              </p>
            </div>

            <div className="space-y-3">
              {activeHighlights.length > 0 ? (
                activeHighlights.map((item) => (
                  <div key={item.id} className="flex flex-row-reverse gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-6 text-slate-700">
                      {item.textAr || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">ما في ميزات بعد.</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                لون الحبر{" "}
                <span className="font-normal text-slate-500">
                  {selectedColor?.nameAr || "—"}
                </span>
              </p>

              <div className="flex flex-wrap justify-end gap-3">
                {form.colors.map((color) => (
                  <div
                    key={color.id}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div
                      className="h-12 w-12 rounded-full border-2 border-white shadow ring-1 ring-slate-300"
                      style={{ backgroundColor: color.hex || "#ddd" }}
                    />
                    <span className="text-xs text-slate-500">
                      {color.nameAr || "لون"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 p-4">
              <p className="text-sm font-medium text-slate-700">الوصف الكامل</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {form.fullDescriptionAr || "الوصف الكامل للمنتج سيظهر هنا."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeFeatures.map((item) => {
            const label = featureIconLabels[item.key];

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-[#f8f6f0] px-4 py-4 text-center"
              >
                <p className="text-xs text-slate-400">{item.icon}</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {label?.en || item.key}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {label?.ar || item.key}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}