import { supabase } from "../supabase";

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function uploadPublicFile(
  bucket: string,
  folder: string,
  file: File
) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.refreshSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Your admin session expired. Please sign in again.");
  }

  if (sessionData.session.user.app_metadata?.role !== "admin") {
    throw new Error("Admin permission is required to upload files.");
  }

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
