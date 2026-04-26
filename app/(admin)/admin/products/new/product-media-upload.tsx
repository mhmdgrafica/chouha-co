"use client";

import type { ChangeEvent } from "react";
import type { ProductFormValues } from "./product-form.types";

type Props = {
  form: ProductFormValues;
  updateField: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => void;
};

export function ProductMediaUpload({ form, updateField }: Props) {
  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Unable to read file."));
      reader.readAsDataURL(file);
    });

  const handleMainImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const preview = await readFileAsDataUrl(file);
    updateField("mainCardImage", {
      id: `main-${crypto.randomUUID()}`,
      type: "image",
      name: file.name,
      preview,
    });
    event.target.value = "";
  };

  const handleGallerySelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const uploads = await Promise.all(
      files.map(async (file) => ({
        id: crypto.randomUUID(),
        type: "image" as const,
        name: file.name,
        preview: await readFileAsDataUrl(file),
      }))
    );

    updateField("galleryImages", [...form.galleryImages, ...uploads]);
    event.target.value = "";
  };

  const handleVideoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const preview = await readFileAsDataUrl(file);
    updateField("video", {
      id: `video-${crypto.randomUUID()}`,
      type: "video",
      name: file.name,
      preview,
    });
    event.target.value = "";
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Product Media</h3>
        <p className="mt-1 text-sm text-slate-500">
          Later we will connect this section to real file uploads.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-dashed border-slate-300 p-5">
          <p className="text-sm font-medium text-slate-700">Main Card Image</p>
          <p className="mt-1 text-sm text-slate-500">
            Main product image used on the card and preview.
          </p>

          <label className="mt-4 inline-flex cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Add Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMainImageSelect}
            />
          </label>

          {form.mainCardImage && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-600">
                  Added: {form.mainCardImage.name}
                </p>
                <button
                  type="button"
                  onClick={() => updateField("mainCardImage", null)}
                  className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.mainCardImage.preview}
                alt={form.mainCardImage.name}
                className="h-28 w-full rounded-2xl border border-slate-200 object-cover"
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 p-5">
          <p className="text-sm font-medium text-slate-700">Gallery Images</p>
          <p className="mt-1 text-sm text-slate-500">
            Additional advertising or supporting images.
          </p>

          <label className="mt-4 inline-flex cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Add Gallery Images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGallerySelect}
            />
          </label>

          {form.galleryImages.length > 0 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {form.galleryImages.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview}
                    alt={item.name}
                    className="h-24 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <p className="min-w-0 truncate text-xs text-slate-600">
                      {item.name}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "galleryImages",
                          form.galleryImages.filter((image) => image.id !== item.id)
                        )
                      }
                      className="rounded-lg border border-rose-200 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 p-5">
          <p className="text-sm font-medium text-slate-700">Optional Video</p>
          <p className="mt-1 text-sm text-slate-500">
            Product video will be added here later.
          </p>

          <label className="mt-4 inline-flex cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Add Video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoSelect}
            />
          </label>

          {form.video && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-600">Added: {form.video.name}</p>
              <button
                type="button"
                onClick={() => updateField("video", null)}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
