import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase-server";
import { createCatalogItem } from "../../../../lib/catalog/catalog-repository";

type CreateCategoryRequestBody = {
  nameEn?: string;
  nameAr?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCategoryRequestBody;
    const supabase = await createAdminClient();
    const category = await createCatalogItem(supabase, {
      table: "categories",
      nameEn: body.nameEn ?? "",
      nameAr: body.nameAr ?? "",
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create category.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
