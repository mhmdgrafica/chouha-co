import { supabase } from "../supabase";

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function uploadPublicFile(
  bucket: string,
  folder: string,
  file: File
) {
  const extension = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}-${sanitizeFileName(
    file.name.replace(new RegExp(`\\.${extension}$`), "")
  )}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
