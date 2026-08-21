import { JsonLd } from "@/components/seo/JsonLd";
import { fuelServices } from "@/lib/home-fuel-content";
import { site } from "@/lib/site";

/**
 * One `Service` per offering, each pointing back at the Organization.
 *
 * The names and descriptions come from `fuelServices.items`, which is what the
 * (01) What we build band renders, so the markup cannot drift from the page.
 * `provider` is a reference to the Organization's `@id` rather than a repeat of
 * its fields — that is what stops a crawler reading three unrelated companies
 * that happen to share a name.
 *
 * Service is not a rich result on its own; it is entity data, and its value is
 * telling Google what this business actually does rather than leaving it to
 * infer that from prose.
 */
export function ServicesSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": fuelServices.items.map((service) => ({
          "@type": "Service",
          "@id": `${site.url}/#service-${service.num}`,
          name: service.title,
          serviceType: service.title,
          description: service.description,
          provider: { "@id": `${site.url}/#organization` },
          areaServed: [
            { "@type": "Country", name: "India" },
            { "@type": "Place", name: "Europe" },
            { "@type": "Country", name: "United States" },
          ],
          url: new URL(service.href, site.url).toString(),
        })),
      }}
    />
  );
}

export default ServicesSchema;
