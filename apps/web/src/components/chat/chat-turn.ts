import type { Message } from '@/lib/types';
import {
  formatChatRecord,
  getSavedLinkPreview,
  getSavedLinkPreviewsById,
  getSearchResultPreviews,
  type SavedLinkPreview,
  type SearchResultPreview,
} from './chat-message';

export interface AssistantTurn {
  kind: 'assistant';
  id: string;
  texts: string[];
  activity?: string;
  warnings: string[];
  sources: SearchResultPreview[];
  saved?: SavedLinkPreview;
  contextLinkId?: string;
}

export interface UserTurn {
  kind: 'user';
  id: string;
  text: string;
}

export type ChatTurn = UserTurn | AssistantTurn;

// Presentation only: tool records stay in Convex, but share one assistant turn
// with their answer. Never infer a successful save from model-written text.
export const getChatTurns = (messages: Message[]): ChatTurn[] => {
  const savedLinks = getSavedLinkPreviewsById(messages.map((message) => ({
    role: message.role ?? '', parts: message.parts,
  })));
  const turns: ChatTurn[] = [];
  let contextLinkId: string | undefined;

  for (const message of messages) {
    if (message.role === 'user' || message.sender === 'user') {
      contextLinkId = message.contextLinkId;
      turns.push({ kind: 'user', id: message.id, text: message.text ?? '' });
      continue;
    }

    const last = turns.at(-1);
    const turn: AssistantTurn = last?.kind === 'assistant' ? last : {
      kind: 'assistant', id: message.id, texts: [], warnings: [], sources: [],
      contextLinkId,
    };
    if (last !== turn) turns.push(turn);

    const parts = message.parts ?? [];
    const texts = parts.flatMap((part) => part.text?.trim() ? [part.text] : []);
    // Older text-only UI records still render; tool summaries are not answers.
    turn.texts.push(...(parts.length ? texts : message.text ? [message.text] : []));

    for (const part of parts) {
      if (!part.functionResponse) continue;
      const status = formatChatRecord({ role: 'function', parts: [part] });
      if (!status) continue;
      turn.activity = status;
      if (status.startsWith('Could not') && !turn.warnings.includes(status)) {
        turn.warnings.push(status);
      }
    }

    const record = { role: message.role ?? '', parts: message.parts };
    const saved = getSavedLinkPreview(record);
    if (saved) turn.saved = saved;
    const results = getSearchResultPreviews(record);
    // Keep the existing five-card cap, with the latest search's actual order.
    if (parts.some((part) => part.functionResponse?.name === 'get_links')) {
      turn.sources = results;
    }
    if (contextLinkId && savedLinks.has(contextLinkId)) {
      turn.sources = [savedLinks.get(contextLinkId)!];
    }
  }
  return turns;
};

export const followUpQuestions = [
  { label: 'Summarize', question: 'Summarize this saved link in a few key points. Use only its stored content and disclose any partial preview or missing text.' },
  { label: 'Show saved text', question: 'Show the available stored text for this saved link. Do not fill gaps from general knowledge; disclose any partial preview or metadata-only capture.' },
] as const;
