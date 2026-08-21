/**
 * One `<script type="application/ld+json">`, rendered server-side.
 *
 * `dangerouslySetInnerHTML` is how a script tag gets its body in React. What
 * goes in is always an object this codebase built, serialised here — never
 * anything a visitor supplied — so there is nothing to inject. The `<` escape
 * is belt and braces: a bare `</script>` inside a JSON string would end the
 * tag early, and while none of our copy contains one, the day someone writes a
 * FAQ answer about HTML is not the day to discover that.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default JsonLd;
