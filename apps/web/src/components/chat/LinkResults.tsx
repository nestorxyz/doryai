import { useId, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { LinkPreviewArtwork } from '../LinkPreviewArtwork';
import type { SearchResultPreview } from './chat-message';

export const SearchResultCard = ({
  result,
}: {
  result: SearchResultPreview;
}) => (
  <a
    href={result.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex h-36 min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#141414] transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:h-40"
  >
    <LinkPreviewArtwork url={result.url} imgPreview={result.imgPreview} />
    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
    {result.contentScope ? (
      <span className="relative z-10 m-2 self-start rounded bg-black/70 px-2 py-0.5 text-[10px] text-amber-200">
        {result.contentScope === 'partial-preview'
          ? 'Partial preview'
          : 'Metadata only'}
      </span>
    ) : null}
    <span className="relative z-10 mt-auto flex min-w-0 flex-col px-3 pb-3">
      <span className="flex items-start justify-between gap-2 text-sm font-semibold text-white">
        <span className="min-w-0 line-clamp-2 break-words">{result.title}</span>
        <ExternalLink
          className="h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
      <span className="mt-1 block truncate text-xs text-gray-300">
        {new URL(result.url).hostname}
      </span>
    </span>
  </a>
);

export const LinkResults = ({
  results,
}: {
  results: SearchResultPreview[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const regionId = useId();
  if (!results.length) return null;
  const remaining = results.length - 3;
  const visible = expanded ? results : results.slice(0, 3);

  return (
    <section
      className="saved-link-results mt-4"
      aria-label="Saved link search results"
    >
      <p className="mb-2 text-xs text-muted-foreground">
        {results.length === 1
          ? '1 saved link'
          : `${results.length} saved links`}
      </p>
      <div id={regionId} className="saved-link-results-grid">
        {visible.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
      {remaining > 0 ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={regionId}
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 min-h-11 rounded-lg px-3 text-sm text-gray-300 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {expanded ? 'Show fewer' : `Show more (${remaining})`}
        </button>
      ) : null}
    </section>
  );
};
