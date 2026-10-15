import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LinkResults } from './LinkResults';
import { AssistantAnswer } from './AssistantAnswer';

describe('link-card answer presentation', () => {
  it('shows three existing-style cards and an accessible expansion control', () => {
    const results = Array.from({ length: 8 }, (_, index) => ({
      id: `${index}`,
      title: `Result ${index}`,
      url: `https://example.com/${index}`,
      contentScope: 'partial-preview' as const,
    }));
    const html = renderToStaticMarkup(<LinkResults results={results} />);
    expect(html.match(/target="_blank"/g)).toHaveLength(3);
    expect(html).toContain('8 saved links');
    expect(html).toContain('Show more (5)');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls=');
    expect(html).toContain('Partial preview');
    expect(html).not.toContain('Result 3');
  });

  it('does not add controls to a single result or an empty answer', () => {
    expect(renderToStaticMarkup(<LinkResults results={[]} />)).toBe('');
    const html = renderToStaticMarkup(
      <LinkResults
        results={[{ id: 'a', title: 'Source', url: 'https://example.com/a' }]}
      />,
    );
    expect(html).toContain('1 saved link');
    expect(html).not.toContain('Show more');
  });

  it('keeps readable Markdown without printing URL destinations or fetching generated images', () => {
    const html = renderToStaticMarkup(
      <AssistantAnswer
        text={
          'Useful **answer**.\n\n[Saved source](https://example.com/secret?utm_source=share)\n\nURL: https://instagram.com/reel/example/?igsh=long\n\nwww.example.com\n\n`https://example.com/code`\n\n![Tracking image](https://tracking.example/pixel.png)'
        }
      />,
    );
    expect(html).toContain('<strong>answer</strong>');
    expect(html).toContain('Saved source');
    expect(html).not.toMatch(/https?:|www\.|<a |<img/);
    expect(html).not.toContain('URL:');
  });
});
