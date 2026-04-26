"use client";

import { useMemo, useState } from "react";
import { FeatureIcon } from "../../../components/feature-icon";
import { featureIconOptions } from "../../../lib/features/feature-icon-options";
import type { ProductFeatureDefinition } from "../../../lib/products/product.types";

type Props = {
  items: ProductFeatureDefinition[];
  loadError?: string | null;
};

export function FeatureDefinitionsManager({ items: initialItems, loadError }: Props) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keyValue, setKeyValue] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [labelAr, setLabelAr] = useState("");
  const [iconName, setIconName] = useState(featureIconOptions[0]);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return editingId ? "Saving feature..." : "Adding feature...";
    }

    return editingId ? "Save feature" : "Add feature";
  }, [editingId, isSubmitting]);

  const resetForm = () => {
    setEditingId(null);
    setKeyValue("");
    setLabelEn("");
    setLabelAr("");
    setIconName(featureIconOptions[0]);
    setDescriptionEn("");
    setDescriptionAr("");
    setIsActive(true);
  };

  const handleEdit = (item: ProductFeatureDefinition) => {
    setEditingId(item.id);
    setKeyValue(item.key);
    setLabelEn(item.label_en);
    setLabelAr(item.label_ar);
    setIconName(item.icon_name as (typeof featureIconOptions)[number]);
    setDescriptionEn(item.description_en ?? "");
    setDescriptionAr(item.description_ar ?? "");
    setIsActive(item.is_active);
    setMessage(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(
        editingId ? `/api/admin/features/${editingId}` : "/api/admin/features",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: keyValue,
            labelEn,
            labelAr,
            iconName,
            descriptionEn,
            descriptionAr,
            isActive,
          }),
        }
      );

      const payload = (await response.json()) as ProductFeatureDefinition & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save feature.");
      }

      setItems((prev) =>
        editingId
          ? prev.map((item) => (item.id === payload.id ? payload : item))
          : [payload, ...prev]
      );

      resetForm();
      setMessage({
        type: "success",
        text: editingId ? "Feature updated successfully." : "Feature added successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to save feature.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/features/${id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete feature.");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));

      if (editingId === id) {
        resetForm();
      }

      setMessage({
        type: "success",
        text: "Feature deleted successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to delete feature.",
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Icon Feature" : "Add Icon Feature"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Define the icon, key, and bilingual labels used in product features.
          </p>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Key</label>
            <input
              type="text"
              value={keyValue}
              onChange={(event) => setKeyValue(event.target.value)}
              placeholder="non_toxic"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Label (EN)</label>
            <input
              type="text"
              value={labelEn}
              onChange={(event) => setLabelEn(event.target.value)}
              placeholder="Non-Toxic"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-right text-sm font-medium text-slate-600">
              التسمية (AR)
            </label>
            <input
              dir="rtl"
              type="text"
              value={labelAr}
              onChange={(event) => setLabelAr(event.target.value)}
              placeholder="غير سام"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Icon</label>
            <select
              value={iconName}
              onChange={(event) =>
                setIconName(event.target.value as (typeof featureIconOptions)[number])
              }
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              {featureIconOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <FeatureIcon name={iconName} className="h-6 w-6 text-slate-900" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              {labelEn || "Preview label"}
            </p>
            <p className="mt-1 text-xs text-slate-500">{labelAr || "معاينة"}</p>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />
            Active and selectable in the product form
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitLabel}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}

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

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {loadError && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Feature Icons</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {items.length} items
          </span>
        </div>

        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <FeatureIcon name={item.icon_name} className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.label_en} / {item.label_ar}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.key} · {item.icon_name} · {item.is_active ? "Active" : "Hidden"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && !loadError && (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No feature icons added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
