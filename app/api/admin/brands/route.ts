import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase-server";
import { createCatalogItem } from "../../../../lib/catalog/catalog-repository";

type CreateBrandRequestBody = {
  nameEn?: string;
  nameAr?: string;
  logoUrl?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBrandRequestBody;
    const supabase = await createAdminClient();
    const brand = await createCatalogItem(supabase, {
      table: "brands",
      nameEn: body.nameEn ?? "",
      nameAr: body.nameAr ?? "",
      logoUrl: body.logoUrl ?? null,
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create brand.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
