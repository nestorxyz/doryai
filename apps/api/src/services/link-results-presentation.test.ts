import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createLinkResultsPart,
  modelHistoryParts,
} from './link-results-presentation';
import type { PresentedLinkRetrievalResult } from './link-retrieval';

const candidates: PresentedLinkRetrievalResult[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: `saved-${index}`,
    title: `Saved source ${index}`,
    url: `https://example.com/${index}`,
    imgPreview: `https://cdn.example.com/${index}.jpg`,
    contentScope: 'partial-preview',
    createdAt: 1,
    contentTruncated: true,
    tags: [],
  }),
);

test('AI selects and orders cards but cannot supply their metadata or unknown IDs', () => {
  const part = createLinkResultsPart(
    {
      answer: 'Estos son los enlaces relevantes.',
      linkIds: ['saved-4', 'other-tenant-id', 'saved-0', 'saved-4'],
      url: 'https://attacker.example',
      title: 'Invented title',
      html: '<script>alert(1)</script>',
    },
    candidates,
  );
  assert.deepEqual(
    part.linkResults.links.map((link) => link.id),
    ['saved-4', 'saved-0'],
  );
  assert.equal(part.linkResults.links[0].title, 'Saved source 4');
  assert.equal(part.linkResults.links[0].url, 'https://example.com/4');
  assert.equal(part.linkResults.links[0].contentScope, 'partial-preview');
  assert.equal(
    part.linkResults.links[0].imgPreview,
    'https://cdn.example.com/4.jpg',
  );
  assert.doesNotMatch(JSON.stringify(part), /attacker|Invented|script/);
});

test('all relevant candidates survive for Show more; an empty selection stays empty', () => {
  assert.equal(
    createLinkResultsPart(
      { answer: 'Matches', linkIds: candidates.map((link) => link.id) },
      candidates,
    ).linkResults.links.length,
    20,
  );
  assert.deepEqual(
    createLinkResultsPart(
      { answer: 'None fit this request.', linkIds: [] },
      candidates,
    ).linkResults.links,
    [],
  );
});

test('malformed payloads are rejected rather than rendering raw JSON', () => {
  for (const input of [
    null,
    { answer: '', linkIds: [] },
    { answer: 'Answer', linkIds: 'saved-0' },
    { answer: 'Answer', linkIds: Array(21).fill('saved-0') },
  ]) {
    assert.throws(() => createLinkResultsPart(input, candidates));
  }
});

test('saved navigation URLs must be safe, even for selected IDs', () => {
  for (const url of [
    'javascript:alert(1)',
    'https://user:pass@example.com/a',
  ]) {
    assert.throws(
      () =>
        createLinkResultsPart({ answer: 'Matches', linkIds: ['unsafe'] }, [
          { ...candidates[0], id: 'unsafe', url },
        ]),
      /Could not select saved links/,
    );
  }
});

test('an invented selection cannot become a successful empty card answer', () => {
  assert.throws(
    () =>
      createLinkResultsPart(
        { answer: 'Here it is', linkIds: ['invented'] },
        candidates,
      ),
    /Please try again/,
  );
});

test('persisted UI payloads never leak into Gemini history parts', () => {
  const part = createLinkResultsPart(
    { answer: 'Useful answer', linkIds: ['saved-0'] },
    candidates,
  );
  assert.deepEqual(
    modelHistoryParts([
      part,
      { functionCall: { name: 'get_links', args: {} } },
      { functionResponse: { name: 'get_links', response: { links: [] } } },
      { html: '<div />' },
    ]),
    [
      { text: 'Useful answer' },
      { functionCall: { name: 'get_links', args: {} } },
      { functionResponse: { name: 'get_links', response: { links: [] } } },
    ],
  );
});
