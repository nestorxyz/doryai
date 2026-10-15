import assert from 'node:assert/strict';
import test from 'node:test';

// These tests cannot contact real Convex or Gemini, even with a local .env.
process.env.GEMINI_API_KEY = 'offline-test-key';
process.env.CONVEX_URL = 'https://offline-test.convex.cloud';
process.env.CONVEX_BACKEND_SECRET = 'offline-test-secret';

test('chat result presentation flow', async (suite) => {
  const { AIService } = await import('./ai.service');
  const { convex, api } = await import('../config/convex');
  const source = {
    id: 'saved-a',
    url: 'https://example.com/a',
    title: 'Saved play ideas',
    contentExcerpt: 'A saved preview about play.',
    contentScope: 'partial-preview' as const,
    createdAt: 1,
    contentTruncated: false,
    tags: [],
  };
  const tool = (name: string, args: unknown) => ({
    functionCall: { name, args },
  });

  for (const scenario of ['search', 'detail', 'invalid', 'empty'] as const) {
    await suite.test(scenario, async (t) => {
      const service = new AIService();
      const calls: any[] = [];
      const writes: any[] = [];
      const outputs = [
        tool('get_links', { stringQuery: 'play' }),
        ...(scenario === 'detail'
          ? [tool('get_link', { linkId: 'saved-a' })]
          : []),
        scenario === 'invalid'
          ? { text: '{"bad":"raw JSON is not a UI"}' }
          : scenario === 'empty'
            ? { text: 'No saved links fit that request.' }
            : tool('render_link_results', {
                answer:
                  'Here are your saved play ideas. Only a partial preview was saved.',
                linkIds: ['saved-a', 'foreign-id'],
              }),
      ];
      // Mock HTTP, not SDK internals: the real SDK validates/translates requests.
      t.mock.method(
        globalThis,
        'fetch',
        async (input: string | URL | Request, init?: RequestInit) => {
          const url = input instanceof Request ? input.url : String(input);
          assert.equal(
            new URL(url).hostname,
            'generativelanguage.googleapis.com',
          );
          calls.push(JSON.parse(String(init?.body)));
          const part = outputs.shift();
          assert.ok(part, 'no extra model rounds');
          return new Response(
            JSON.stringify({
              candidates: [{ content: { role: 'model', parts: [part] } }],
            }),
            { headers: { 'content-type': 'application/json' } },
          );
        },
      );
      t.mock.method(convex, 'query', async (ref: any) => {
        if (ref === api.chat.getMessagesForBackend)
          return [
            {
              role: 'user',
              parts: [
                {
                  text: 'Saved history',
                  linkResults: { version: 1, links: [] },
                },
              ],
            },
          ];
        if (
          [
            api.categories.getByUser,
            api.subCategories.getByUser,
            api.tags.getByUser,
          ].includes(ref)
        )
          return [];
        throw new Error('Unexpected Convex read');
      });
      t.mock.method(convex, 'mutation', async (ref: any, args: any) => {
        assert.equal(ref, api.chat.saveMessage);
        assert.equal(args.sessionId, 'session-a');
        writes.push(args);
        return null;
      });
      t.mock.method(service, 'searchUserLinks', async (userId: string) => {
        assert.equal(userId, 'tenant-a');
        return { success: true, data: scenario === 'empty' ? [] : [source] };
      });
      t.mock.method(
        service,
        'getSavedLinkContent',
        async (userId: string, id: string) => {
          assert.equal(userId, 'tenant-a');
          assert.equal(id, 'saved-a');
          return { ...source, content: 'Only the saved preview.' };
        },
      );
      const result = await service.processChatMessage({
        userId: 'tenant-a',
        sessionId: 'session-a',
        message:
          scenario === 'detail'
            ? 'Tell me what my saved link about play says.'
            : 'Find my saved links about play.',
      });
      assert.equal(result.success, scenario !== 'invalid');
      const final = writes.filter(
        (write) => write.role === 'model' && write.parts[0]?.text,
      );
      if (scenario === 'invalid') {
        assert.equal(final.length, 0);
        assert.match(result.error!, /Please try again/);
      } else if (scenario === 'empty') {
        assert.equal(final[0].parts[0].linkResults, undefined);
        assert.equal(
          calls.at(-1).toolConfig.functionCallingConfig.mode,
          'NONE',
        );
      } else {
        assert.deepEqual(
          final[0].parts[0].linkResults.links.map((link: any) => link.id),
          ['saved-a'],
        );
        assert.deepEqual(
          calls.at(-1).toolConfig.functionCallingConfig.allowedFunctionNames,
          ['render_link_results'],
        );
        assert.equal(
          writes.find((write) => write.role === 'function').parts[0]
            .functionResponse.response.presentation,
          'pending',
        );
      }
      assert.equal(outputs.length, 0);
      assert.ok(
        calls.every(
          (call) => !JSON.stringify(call.contents).includes('linkResults'),
        ),
      );
    });
  }
});
