import { describe, expect, it } from 'vitest';
import type { Message, MessagePart } from '@/lib/types';
import { followUpQuestions, getChatTurns } from './chat-turn';

const user = (id: string, contextLinkId?: string): Message => ({
  id, sender: 'user', role: 'user', text: 'My question', contextLinkId,
});
const bot = (id: string, parts: MessagePart[]): Message => ({
  id, sender: 'bot', role: 'model', parts,
});
const tool = (id: string, name: string, response: Record<string, unknown>) =>
  bot(id, [{ functionResponse: { name, response } }]);
const link = { id: 'a', title: 'Saved article', url: 'https://example.com/a' };

describe('chat turn presentation', () => {
  it('groups analysis, confirmed save and answer without tool-summary prose', () => {
    const turns = getChatTurns([
      user('u'), tool('analysis', 'get_url_info', { success: true }),
      tool('save', 'register_link', { success: true, data: link }),
      bot('answer', [{ text: 'Your article is saved.' }]),
    ]);
    expect(turns).toHaveLength(2);
    expect(turns[1]).toMatchObject({
      kind: 'assistant', activity: 'Link saved.',
      texts: ['Your article is saved.'], saved: link,
    });
  });

  it('never hides an extraction failure behind later successful tool activity', () => {
    const turns = getChatTurns([
      user('u'), tool('fail', 'get_url_info', { success: false, error: 'Blocked' }),
      tool('other', 'get_links', { links: [link] }),
    ]);
    expect(turns[1]).toMatchObject({
      activity: 'Found 1 saved link.', warnings: ['Could not analyze the link: Blocked'],
    });
  });

  it('does not call a duplicate or model claim a newly saved link', () => {
    const turns = getChatTurns([
      user('u'), tool('duplicate', 'register_link', { success: true, data: { ...link, duplicate: true } }),
      bot('answer', [{ text: 'Saved!' }]),
    ]);
    expect(turns[1]).toMatchObject({ activity: 'Link was already saved.' });
    expect(turns[1]).not.toHaveProperty('saved');
  });

  it('retains partial scope and binds the next question to the exact selected link', () => {
    const turns = getChatTurns([
      user('save-u'), tool('save', 'register_link', { success: true, data: { ...link, contentScope: 'partial-preview' } }),
      user('ask-u', 'a'), tool('search', 'get_links', { links: [{ ...link, id: 'unrelated' }] }),
      bot('answer', [{ text: 'A partial answer.' }]),
    ]);
    expect(turns[3]).toMatchObject({ contextLinkId: 'a', sources: [{ ...link, contentScope: 'partial-preview' }] });
  });

  it('does not carry selected-link context into an unrelated next question', () => {
    const turns = getChatTurns([
      user('one', 'a'), bot('first', [{ text: 'First.' }]),
      user('two'), bot('second', [{ text: 'Second.' }]),
    ]);
    expect(turns[3]).toMatchObject({ contextLinkId: undefined, sources: [] });
  });

  it('keeps mixed text/tool records and an honest no-result status', () => {
    expect(getChatTurns([user('u'), bot('b', [
      { text: 'I could not find it.' },
      { functionResponse: { name: 'get_links', response: { links: [] } } },
    ])])[1]).toMatchObject({ texts: ['I could not find it.'], activity: 'No saved links matched that search.', sources: [] });
  });

  it('keeps orphan history and legacy text without inventing an activity', () => {
    const turn = getChatTurns([{ id: 'legacy', sender: 'bot', text: 'Existing answer.' }])[0];
    expect(turn).toMatchObject({ texts: ['Existing answer.'] });
    expect(turn).not.toHaveProperty('activity');
  });

  it('clears stale cards when a later search in the same turn returns no matches', () => {
    expect(getChatTurns([
      user('u'), tool('first', 'get_links', { links: [link] }),
      tool('second', 'get_links', { links: [] }),
    ])[1]).toMatchObject({ sources: [], activity: 'No saved links matched that search.' });
  });

  it('requires stored evidence in both follow-up prompts', () => {
    expect(followUpQuestions.map(({ label }) => label)).toEqual(['Summarize', 'Show saved text']);
    expect(followUpQuestions.every(({ question }) => /stored/.test(question) && /partial/.test(question))).toBe(true);
  });
});
