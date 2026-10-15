import { z } from 'zod';
import { Type, type FunctionDeclaration } from '@google/genai';
import type { PresentedLinkRetrievalResult } from './link-retrieval';
import { normalizeUserUrl } from './user-url';

export const linkResultsTool: FunctionDeclaration = {
  name: 'render_link_results',
  description:
    'Present the final answer and saved-link cards. This ends the turn; it does not search, fetch, or save anything.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      answer: {
        type: Type.STRING,
        description:
          "A concise answer in the user's language, grounded in saved content. No URLs, Markdown links, or repeated catalogue of titles. Disclose missing or partial content. Give more detail only when requested.",
      },
      linkIds: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          "IDs from this turn's get_links results that actually fit the request, strongest first. Include all relevant matches (up to 20), not just the initial visible cards. Use [] if none fit. Never invent IDs or include unrelated matches.",
      },
    },
    required: ['answer', 'linkIds'],
  },
};

const presentationArgs = z.object({
  answer: z.string().trim().min(1).max(12000),
  linkIds: z.array(z.string().min(1).max(128)).max(20),
});

/** Only server-read candidates can supply URLs, images, titles, and scope. */
export const createLinkResultsPart = (
  input: unknown,
  candidates: PresentedLinkRetrievalResult[],
) => {
  const parsed = presentationArgs.safeParse(input);
  if (!parsed.success)
    throw new Error('Could not prepare link cards. Please try again.');
  const { answer, linkIds } = parsed.data;
  const byId = new Map(candidates.map((link) => [link.id, link]));
  const links = [...new Set(linkIds)].flatMap((id) => {
    const link = byId.get(id);
    if (!link) return [];
    try {
      return [
        {
          id,
          url: normalizeUserUrl(link.url),
          title: link.title,
          ...(link.imgPreview ? { imgPreview: link.imgPreview } : {}),
          ...(link.contentScope ? { contentScope: link.contentScope } : {}),
        },
      ];
    } catch {
      return [];
    }
  });
  if (linkIds.length && !links.length) {
    throw new Error('Could not select saved links. Please try again.');
  }
  return { text: answer, linkResults: { version: 1, links } };
};

/** UI payloads are persisted next to text, never sent back as Gemini Parts. */
export const modelHistoryParts = (
  parts: unknown,
): Record<string, unknown>[] => {
  if (!Array.isArray(parts)) return [];
  return parts.flatMap<Record<string, unknown>>((part) => {
    if (!part || typeof part !== 'object') return [];
    if (typeof part.text === 'string') return [{ text: part.text }];
    if (part.functionCall) return [{ functionCall: part.functionCall }];
    if (part.functionResponse)
      return [{ functionResponse: part.functionResponse }];
    return [];
  });
};
