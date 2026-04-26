import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase-server";
import type { ProductFormValues, ProductStatus } from "../../../../lib/products/product.types";
import { saveProductRecord } from "../../../../lib/products/product-repository";

type SaveProductRequestBody = {
  productId?: string | null;
  form: ProductFormValues;
  status?: ProductStatus;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveProductRequestBody;

    if (!body?.form) {
      return NextResponse.json(
        { error: "Product form data is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const savedProduct = await saveProductRecord(supabase, {
      productId: body.productId,
      form: body.form,
      status: body.status ?? "draft",
    });

    return NextResponse.json({
      productId: savedProduct.id,
      slug: savedProduct.slug,
      status: body.status ?? "draft",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save product.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
