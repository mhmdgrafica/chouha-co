import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../../lib/supabase-server";
import {
  deleteCatalogItem,
  updateCatalogItem,
} from "../../../../../lib/catalog/catalog-repository";

type CategoryRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateCategoryRequestBody = {
  nameEn?: string;
  nameAr?: string;
};

export async function PATCH(request: Request, context: CategoryRouteContext) {
  try {
    const body = (await request.json()) as UpdateCategoryRequestBody;
    const { id } = await context.params;
    const supabase = await createAdminClient();
    const category = await updateCatalogItem(supabase, {
      id,
      table: "categories",
      nameEn: body.nameEn ?? "",
      nameAr: body.nameAr ?? "",
    });

    return NextResponse.json(category);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update category.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: CategoryRouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createAdminClient();
    await deleteCatalogItem(supabase, "categories", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete category.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
