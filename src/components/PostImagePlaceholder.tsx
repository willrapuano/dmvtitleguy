/**
 * Branded stand-in for a post card with no picture: a post that opted out of
 * display images, or one whose image failed to load.
 *
 * The wash varies by slug so a run of placeholders doesn't read as one flat navy
 * block. Deterministic, so SSR and client agree.
 */
const PLACEHOLDER_WASHES = [
  "radial-gradient(circle at 28% 24%, #1B3F6B 0%, #0B1D3A 58%, #071428 100%)",
  "radial-gradient(circle at 72% 30%, #17395F 0%, #0B1D3A 60%, #071428 100%)",
  "linear-gradient(135deg, #123458 0%, #0B1D3A 55%, #071428 100%)",
];

function placeholderWash(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_WASHES[hash % PLACEHOLDER_WASHES.length];
}

export function PostImagePlaceholder({ slug }: { slug: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundImage: placeholderWash(slug) }}
    >
      {/* Decorative watermark — the category already appears next to the card. */}
      <span aria-hidden="true" className="text-base font-bold tracking-tight text-white/40">
        DMV <span className="text-brand-blue/70">Title Guy</span>
      </span>
    </div>
  );
}
