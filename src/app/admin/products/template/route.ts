import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { buildTemplateZip } from "@/lib/product-import";
import { listMedia, productInputFor } from "@/lib/products-admin";

export const dynamic = "force-dynamic";

/**
 * GET /admin/products/template            → blank ZIP (product.xlsx + README)
 * GET /admin/products/template?slug=<slug> → ZIP pre-filled with that product (edit → re-import)
 */
export async function GET(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (slug && !/^[a-z0-9-]{1,80}$/.test(slug)) return new NextResponse("Bad slug", { status: 400 });

  const current = slug ? await productInputFor(slug) : null;
  if (slug && !current) return new NextResponse("Not found", { status: 404 });
  const photos = slug ? (await listMedia(slug)).map((m) => m.url) : [];

  const zip = await buildTemplateZip(current, photos);
  const name = slug ? `${slug}.zip` : "techhala-product-template.zip";
  return new NextResponse(new Blob([zip as BlobPart], { type: "application/zip" }), {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${name}"`,
      "cache-control": "no-store",
    },
  });
}
