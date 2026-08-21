import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/lib/home-content";
import { site } from "@/lib/site";

/**
 * FAQPage for the homepage accordion.
 *
 * Built from `faqs.items` — the same array FuelFaqs renders — rather than from
 * a restated copy of the questions. That is not tidiness: Google requires the
 * marked-up text to match what a visitor can actually see on the page, and the
 * only way to guarantee that under future copy edits is to have one source.
 *
 * Required fields are `mainEntity`, each a `Question` with `name` and an
 * `acceptedAnswer` of type `Answer` carrying `text`.
 */
export function FaqSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faqs.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

export default FaqSchema;
