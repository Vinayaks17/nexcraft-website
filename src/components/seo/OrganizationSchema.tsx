import { contact, marketsServed, site } from "@/lib/site";

/**
 * Organization JSON-LD for the homepage.
 *
 * A server component with no client bundle: this is markup Google reads, not
 * anything a visitor interacts with. `dangerouslySetInnerHTML` is how a
 * `<script type="application/ld+json">` gets its body in React — the content
 * is our own object serialised here, never user input, so there is nothing to
 * inject.
 *
 * The type is ProfessionalService rather than plain Organization: it inherits
 * everything Organization has and adds the fields that make a studio legible
 * to search — what it does and where it does it from.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    /* `logo` is the mark; `image` is the social card. Google reads the first
       for knowledge-panel branding and wants something square and legible on
       its own, which the 1200x630 card is not — hence the 512 square. It is
       transparent, which is correct here: consumers of this field composite it
       onto their own ground, usually white, where the mark reads properly. */
    logo: new URL("/logo-square.png", site.url).toString(),
    image: new URL(site.ogImage, site.url).toString(),
    description: site.description,
    slogan: "Websites. Automations. Built from scratch.",
    foundingDate: "2024-01-15",
    email: contact.email,
    telephone: contact.phone,
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    areaServed: marketsServed,
    sameAs: [contact.linkedin],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: contact.email,
        telephone: contact.phone,
        availableLanguage: ["English"],
        areaServed: marketsServed,
        url: new URL("/contact", site.url).toString(),
      },
    ],
    knowsAbout: [
      "Web design",
      "Web development",
      "Business process automation",
      "Search engine optimization",
      "E-commerce",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default OrganizationSchema;
