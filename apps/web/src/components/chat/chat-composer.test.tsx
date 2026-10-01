import React, { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ChatComposer } from './chat-composer';

const render = (value: string, disabled = false, working = false) =>
  renderToStaticMarkup(<ChatComposer value={value} onChange={() => {}} onSend={() => {}} inputRef={createRef()} working={working} disabled={disabled} />);

describe('chat composer', () => {
  it('labels the input and send control and explains the two available jobs', () => {
    const html = render('A question');
    expect(html).toContain('aria-label="Message DoryAI"');
    expect(html).toContain('aria-label="Send message"');
    expect(html).toContain('aria-describedby="chat-composer-hint"');
    expect(html).toContain('Paste a link or ask about your library');
    expect(html).toContain('focus-within:ring-2');
  });

  it('prevents empty and unavailable submissions while preserving draft text', () => {
    expect(render('   ')).toContain('disabled=""');
    expect(render('My draft', true, true)).toContain('disabled=""');
    expect(render('My draft', true, true)).toContain('My draft</textarea>');
    expect(render('A question')).not.toContain('disabled=""');
  });
});
