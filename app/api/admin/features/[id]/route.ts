import { NextResponse } from "next/server";
import { deleteFeatureDefinition, updateFeatureDefinition } from "../../../../../lib/features/feature-definitions-repository";
import { createAdminClient } from "../../../../../lib/supabase-server";

type FeatureRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: FeatureRouteContext) {
  try {
    const body = (await request.json()) as {
      key?: string;
      labelEn?: string;
      labelAr?: string;
      iconName?: string;
      descriptionEn?: string;
      descriptionAr?: string;
      isActive?: boolean;
    };
    const { id } = await context.params;
    const supabase = await createAdminClient();
    const feature = await updateFeatureDefinition(supabase, id, {
      key: body.key ?? "",
      labelEn: body.labelEn ?? "",
      labelAr: body.labelAr ?? "",
      iconName: body.iconName ?? "",
      descriptionEn: body.descriptionEn ?? "",
      descriptionAr: body.descriptionAr ?? "",
      isActive: body.isActive ?? true,
    });

    return NextResponse.json(feature);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update feature.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: FeatureRouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createAdminClient();
    await deleteFeatureDefinition(supabase, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete feature.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
