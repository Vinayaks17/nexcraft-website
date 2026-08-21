import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

/**
 * BreadcrumbList for an inner page.
 *
 * The site is two levels deep everywhere — Home, then the page — so every
 * trail is the same shape and the component takes only the leaf. Google's
 * required fields are `itemListElement` with a `position` and a `name` on each
 * `ListItem`; `item` is required on every entry except the last, which is the
 * page the user is already on and therefore needs no link.
 */
export function BreadcrumbSchema({ name, path }: { name: string; path: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name,
            item: new URL(path, site.url).toString(),
          },
        ],
      }}
    />
  );
}

export default BreadcrumbSchema;
