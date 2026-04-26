import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductFeatureDefinition, ProductFeatureIcon } from "../products/product.types";

type FeatureClient = SupabaseClient;

export type FeatureDefinitionInput = {
  key: string;
  labelEn: string;
  labelAr: string;
  iconName: string;
  descriptionEn?: string;
  descriptionAr?: string;
  isActive?: boolean;
};

function normalizeFeatureKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function listFeatureDefinitions(
  supabase: FeatureClient
): Promise<ProductFeatureDefinition[]> {
  const { data, error } = await supabase
    .from("feature_definitions")
    .select(
      "id, key, label_en, label_ar, icon_name, description_en, description_ar, is_active"
    )
    .order("label_en", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProductFeatureDefinition[];
}

export async function listActiveFeatureIcons(
  supabase: FeatureClient
): Promise<ProductFeatureIcon[]> {
  const definitions = await listFeatureDefinitions(supabase);

  return definitions
    .filter((item) => item.is_active)
    .map((item) => ({
      id: item.id,
      key: item.key,
      labelEn: item.label_en,
      labelAr: item.label_ar,
      iconName: item.icon_name,
      selected: false,
    }));
}

export async function createFeatureDefinition(
  supabase: FeatureClient,
  input: FeatureDefinitionInput
): Promise<ProductFeatureDefinition> {
  const key = normalizeFeatureKey(input.key || input.labelEn);

  if (!key || !input.labelEn.trim() || !input.labelAr.trim() || !input.iconName.trim()) {
    throw new Error("Key, Arabic label, English label, and icon are required.");
  }

  const { data, error } = await supabase
    .from("feature_definitions")
    .insert({
      key,
      label_en: input.labelEn.trim(),
      label_ar: input.labelAr.trim(),
      icon_name: input.iconName.trim(),
      description_en: input.descriptionEn?.trim() || null,
      description_ar: input.descriptionAr?.trim() || null,
      is_active: input.isActive ?? true,
    })
    .select(
      "id, key, label_en, label_ar, icon_name, description_en, description_ar, is_active"
    )
    .single();

  if (error) {
    throw error;
  }

  return data as ProductFeatureDefinition;
}

export async function updateFeatureDefinition(
  supabase: FeatureClient,
  id: string,
  input: FeatureDefinitionInput
): Promise<ProductFeatureDefinition> {
  const key = normalizeFeatureKey(input.key || input.labelEn);

  if (!key || !input.labelEn.trim() || !input.labelAr.trim() || !input.iconName.trim()) {
    throw new Error("Key, Arabic label, English label, and icon are required.");
  }

  const { data, error } = await supabase
    .from("feature_definitions")
    .update({
      key,
      label_en: input.labelEn.trim(),
      label_ar: input.labelAr.trim(),
      icon_name: input.iconName.trim(),
      description_en: input.descriptionEn?.trim() || null,
      description_ar: input.descriptionAr?.trim() || null,
      is_active: input.isActive ?? true,
    })
    .eq("id", id)
    .select(
      "id, key, label_en, label_ar, icon_name, description_en, description_ar, is_active"
    )
    .single();

  if (error) {
    throw error;
  }

  return data as ProductFeatureDefinition;
}

export async function deleteFeatureDefinition(
  supabase: FeatureClient,
  id: string
) {
  const { error } = await supabase
    .from("feature_definitions")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
