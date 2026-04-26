"use client";

import { useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { CatalogItem, CatalogTable } from "../../../../lib/catalog/catalog.types";
import { storageBuckets } from "../../../../lib/storage/storage.constants";
import { uploadPublicFile } from "../../../../lib/storage/upload-client";

type CatalogItemManagerProps = {
  table: CatalogTable;
  items: CatalogItem[];
  loadError?: string | null;
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

export function CatalogItemManager({
  table,
  items: initialItems,
  loadError = null,
}: CatalogItemManagerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState(initialItems);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState>(null);

  const isBrandTable = table === "brands";
  const endpointBase = `/api/admin/${table}`;
  const title = isBrandTable ? "Brand" : "Category";
  const titlePlural = isBrandTable ? "Brands" : "Categories";
  const description = isBrandTable
    ? "Create or update a brand in English and Arabic, with an optional logo."
    : "Create or update a category in English and Arabic.";

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return editingItemId ? `Saving ${title}...` : `Adding ${title}...`;
    }

    return editingItemId ? `Save ${title}` : `Add ${title}`;
  }, [editingItemId, isSubmitting, title]);

  const resetForm = () => {
    setEditingItemId(null);
    setNameEn("");
    setNameAr("");
    setLogoUrl("");
  };

  const handleSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await readFileAsDataUrl(file);
      const upload = await uploadPublicFile(
        storageBuckets.brands,
        "brands/logos",
        file
      );
      setLogoUrl(upload.publicUrl);
      setMessage(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to read image.",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItemId(item.id);
    setNameEn(item.name_en);
    setNameAr(item.name_ar);
    setLogoUrl(item.logo_url ?? "");
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setMessage(null);

    try {
      const response = await fetch(`${endpointBase}/${id}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || `Unable to delete ${title.toLowerCase()}.`);
      }

      setItems((prev) => prev.filter((item) => item.id !== id));

      if (editingItemId === id) {
        resetForm();
      }

      setMessage({
        type: "success",
        text: `${title} deleted successfully.`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : `Unable to delete ${title.toLowerCase()}.`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(
        editingItemId ? `${endpointBase}/${editingItemId}` : endpointBase,
        {
          method: editingItemId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameEn,
            nameAr,
            logoUrl: isBrandTable ? logoUrl : undefined,
          }),
        }
      );

      const payload = (await response.json()) as {
        error?: string;
      } & CatalogItem;

      if (!response.ok) {
        throw new Error(payload.error || `Unable to save ${title.toLowerCase()}.`);
      }

      setItems((prev) => {
        if (editingItemId) {
          return prev.map((item) => (item.id === payload.id ? payload : item));
        }

        return [payload, ...prev];
      });

      resetForm();
      setMessage({
        type: "success",
        text: editingItemId
          ? `${title} updated successfully.`
          : `${title} added successfully.`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : `Unable to save ${title.toLowerCase()}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {editingItemId ? `Edit ${title}` : `Add ${title}`}
          </h3>
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
              placeholder={isBrandTable ? "Pilot" : "Markers"}
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
              placeholder={isBrandTable ? "بايلوت" : "أقلام سبورة"}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none focus:border-slate-400"
            />
          </div>

          {isBrandTable && (
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Brand Image
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose an image from your device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Add Image
                </button>
              </div>

              <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectFile}
              />

              {logoUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt={nameEn || "Brand image"}
                    className="h-36 w-full object-contain p-4"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                  No image selected yet.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
          </button>

          {editingItemId && (
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
          <h3 className="text-lg font-semibold text-slate-900">
            {titlePlural} List
          </h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {items.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {isBrandTable && (
                  <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Image
                  </th>
                )}
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  English
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Arabic
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Slug
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {isBrandTable && (
                    <td className="border-b border-slate-100 px-4 py-4">
                      {item.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.logo_url}
                          alt={item.name_en}
                          className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400">
                          IMG
                        </div>
                      )}
                    </td>
                  )}
                  <td className="border-b border-slate-100 px-4 py-4 text-sm font-medium text-slate-900">
                    {item.name_en}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                    {item.name_ar}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-500">
                    {item.slug}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-4">
                    <div className="flex justify-end gap-2">
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
                        disabled={deletingId === item.id}
                        className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && !loadError && (
                <tr>
                  <td
                    colSpan={isBrandTable ? 5 : 4}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    No {table} found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
