import type { MetadataRoute } from "next";
import { ALLOW_INDEXING } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return ALLOW_INDEXING
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
