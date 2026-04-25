"use client";

import type { ProductColorOption } from "./product-form.types";

type Props = {
  colors: ProductColorOption[];
  selectedColorId: string | null;
  onChange: (items: ProductColorOption[]) => void;
  onSelectColor: (colorId: string) => void;
};

export function ProductColors({
  colors,
  selectedColorId,
  onChange,
  onSelectColor,
}: Props) {
  const updateColor = (
    id: string,
    key: keyof ProductColorOption,
    value: string
  ) => {
    onChange(
      colors.map((color) =>
        color.id === id ? { ...color, [key]: value } : color
      )
    );
  };

  const addColor = () => {
    onChange([
      ...colors,
      {
        id: crypto.randomUUID(),
        nameEn: "",
        nameAr: "",
        hex: "#000000",
        productCode: "",
        thumbnailPreview: "",
        mainImagePreview: "",
      },
    ]);
  };

  const removeColor = (id: string) => {
    onChange(colors.filter((color) => color.id !== id));
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Colour Options</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add the colors shown on the product page in both languages.
          </p>
        </div>

        <button
          type="button"
          onClick={addColor}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Add Colour
        </button>
      </div>

      <div className="space-y-4">
        {colors.map((color) => (
          <div
            key={color.id}
            className={`rounded-2xl border p-4 ${
              selectedColorId === color.id
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelectColor(color.id)}
                className="text-left"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {color.nameEn || color.nameAr || "New Colour"}
                </p>
                <p className="text-xs text-slate-500">
                  {color.productCode || "No code yet"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => removeColor(color.id)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Delete
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Colour Name (EN)
                </label>
                <input
                  type="text"
                  value={color.nameEn}
                  onChange={(e) => updateColor(color.id, "nameEn", e.target.value)}
                  placeholder="Red"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-right text-sm font-medium text-slate-600">
                  اسم اللون (AR)
                </label>
                <input
                  dir="rtl"
                  type="text"
                  value={color.nameAr}
                  onChange={(e) => updateColor(color.id, "nameAr", e.target.value)}
                  placeholder="أحمر"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Product Code
                </label>
                <input
                  type="text"
                  value={color.productCode}
                  onChange={(e) =>
                    updateColor(color.id, "productCode", e.target.value)
                  }
                  placeholder="660103"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Colour Hex
                </label>
                <input
                  type="text"
                  value={color.hex}
                  onChange={(e) => updateColor(color.id, "hex", e.target.value)}
                  placeholder="#dc2626"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Thumbnail Image
                </label>
                <input
                  type="text"
                  value={color.thumbnailPreview}
                  onChange={(e) =>
                    updateColor(color.id, "thumbnailPreview", e.target.value)
                  }
                  placeholder="Thumbnail placeholder"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Main Switch Image
                </label>
                <input
                  type="text"
                  value={color.mainImagePreview}
                  onChange={(e) =>
                    updateColor(color.id, "mainImagePreview", e.target.value)
                  }
                  placeholder="Main image placeholder"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}