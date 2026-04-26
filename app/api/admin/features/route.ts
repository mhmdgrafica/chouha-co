import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase-server";
import { createFeatureDefinition } from "../../../../lib/features/feature-definitions-repository";

export async function POST(request: Request) {
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

    const supabase = await createAdminClient();
    const feature = await createFeatureDefinition(supabase, {
      key: body.key ?? "",
      labelEn: body.labelEn ?? "",
      labelAr: body.labelAr ?? "",
      iconName: body.iconName ?? "",
      descriptionEn: body.descriptionEn ?? "",
      descriptionAr: body.descriptionAr ?? "",
      isActive: body.isActive ?? true,
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create feature.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
