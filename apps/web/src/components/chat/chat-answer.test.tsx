import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ChatAnswer } from './chat-answer';

describe('chat answer rendering', () => {
  it('renders paragraphs, headings, lists and horizontally scrollable tables', () => {
    const html = renderToStaticMarkup(<ChatAnswer sources={[]} text={'## Key points\n\nFirst paragraph.\n\nSecond paragraph.\n\n- One\n- Two\n\n| A | B |\n|---|---|\n| 1 | 2 |'} />);
    expect(html).toContain('<h2>Key points</h2>');
    expect(html).toContain('<p>Second paragraph.</p>');
    expect(html).toContain('<ul>');
    expect(html).toContain('class="overflow-x-auto"');
  });

  it('makes raw saved URLs readable without changing the destination', () => {
    const url = 'https://example.com/a?tracking=long';
    const html = renderToStaticMarkup(<ChatAnswer sources={[{ id: 'a', title: 'Saved article', url }]} text={`Read ${url}`} />);
    expect(html).toContain(`href="${url}"`);
    expect(html).toContain('>Saved article</a>');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('does not render credential-bearing or non-web links as clickable sources', () => {
    const html = renderToStaticMarkup(<ChatAnswer sources={[]} text={'[unsafe](https://user:secret@example.com/) [mail](mailto:someone@example.com)'} />);
    expect(html).not.toContain('<a ');
    expect(html).toContain('unsafe');
    expect(html).toContain('mail');
  });
});
