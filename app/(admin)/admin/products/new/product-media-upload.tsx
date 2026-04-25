"use client";

import type { ProductFormValues } from "./product-form.types";

type Props = {
  form: ProductFormValues;
  updateField: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => void;
};

export function ProductMediaUpload({ form, updateField }: Props) {
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

          <button
            type="button"
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() =>
              updateField("mainCardImage", {
                id: "main-image",
                type: "image",
                name: "Main Product Image",
                preview: "",
              })
            }
          >
            Add Placeholder
          </button>

          {form.mainCardImage && (
            <p className="mt-3 text-sm text-slate-600">
              Added: {form.mainCardImage.name}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 p-5">
          <p className="text-sm font-medium text-slate-700">Gallery Images</p>
          <p className="mt-1 text-sm text-slate-500">
            Additional advertising or supporting images.
          </p>

          <button
            type="button"
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() =>
              updateField("galleryImages", [
                ...form.galleryImages,
                {
                  id: crypto.randomUUID(),
                  type: "image",
                  name: `Gallery Image ${form.galleryImages.length + 1}`,
                  preview: "",
                },
              ])
            }
          >
            Add Gallery Placeholder
          </button>

          {form.galleryImages.length > 0 && (
            <div className="mt-3 space-y-2">
              {form.galleryImages.map((item) => (
                <p key={item.id} className="text-sm text-slate-600">
                  {item.name}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 p-5">
          <p className="text-sm font-medium text-slate-700">Optional Video</p>
          <p className="mt-1 text-sm text-slate-500">
            Product video will be added here later.
          </p>

          <button
            type="button"
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() =>
              updateField("video", {
                id: "video-1",
                type: "video",
                name: "Product Video",
                preview: "",
              })
            }
          >
            Add Video Placeholder
          </button>

          {form.video && (
            <p className="mt-3 text-sm text-slate-600">
              Added: {form.video.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}