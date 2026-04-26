import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../../lib/supabase-server";
import {
  deleteCatalogItem,
  updateCatalogItem,
} from "../../../../../lib/catalog/catalog-repository";

type BrandRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBrandRequestBody = {
  nameEn?: string;
  nameAr?: string;
  logoUrl?: string | null;
};

export async function PATCH(request: Request, context: BrandRouteContext) {
  try {
    const body = (await request.json()) as UpdateBrandRequestBody;
    const { id } = await context.params;
    const supabase = await createAdminClient();
    const brand = await updateCatalogItem(supabase, {
      id,
      table: "brands",
      nameEn: body.nameEn ?? "",
      nameAr: body.nameAr ?? "",
      logoUrl: body.logoUrl ?? null,
    });

    return NextResponse.json(brand);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update brand.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: BrandRouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createAdminClient();
    await deleteCatalogItem(supabase, "brands", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete brand.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
