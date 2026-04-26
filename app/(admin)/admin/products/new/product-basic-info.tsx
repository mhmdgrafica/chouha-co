"use client";

import Link from "next/link";
import type { CatalogItem } from "../../../../../lib/catalog/catalog.types";
import type { ProductFormValues } from "./product-form.types";

type Props = {
  form: ProductFormValues;
  brandOptions: CatalogItem[];
  categoryOptions: CatalogItem[];
  updateField: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => void;
};

export function ProductBasicInfo({
  form,
  brandOptions,
  categoryOptions,
  updateField,
}: Props) {
  const hasBrands = brandOptions.length > 0;
  const hasCategories = categoryOptions.length > 0;
  const selectedBrand =
    brandOptions.find((brand) => brand.id === form.brandId) ?? null;

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
          <select
            value={form.brandId}
            onChange={(e) => updateField("brandId", e.target.value)}
            disabled={!hasBrands}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {hasBrands ? "Select brand" : "Add brands first"}
            </option>
            {brandOptions.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name_en} / {brand.name_ar}
              </option>
            ))}
          </select>
          {selectedBrand?.logo_url && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedBrand.logo_url}
                alt={selectedBrand.name_en}
                className="h-12 w-12 rounded-xl border border-slate-200 object-contain bg-white p-1"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedBrand.name_en}
                </p>
                <p className="text-xs text-slate-500">{selectedBrand.name_ar}</p>
              </div>
            </div>
          )}
          {!hasBrands && (
            <p className="mt-2 text-sm text-amber-700">
              No brands yet. Add them from{" "}
              <Link href="/admin/brands" className="font-semibold underline">
                Brands
              </Link>
              .
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-600">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            disabled={!hasCategories}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {hasCategories ? "Select category" : "Add categories first"}
            </option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_en} / {category.name_ar}
              </option>
            ))}
          </select>
          {!hasCategories && (
            <p className="mt-2 text-sm text-amber-700">
              No categories yet. Add them from{" "}
              <Link href="/admin/categories" className="font-semibold underline">
                Categories
              </Link>
              .
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-600">
            Stock Status
          </label>
          <select
            value={form.stockStatus}
            onChange={(e) => updateField("stockStatus", e.target.value as ProductFormValues["stockStatus"])}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
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
