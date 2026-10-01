import {
  useState,
  useRef,
  useEffect,
  memo,
  useDeferredValue,
  useMemo,
  useCallback,
} from 'react';
import {
  Trash2,
  Link as LinkIcon,
  ExternalLink,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react';
import { Message } from '@/lib/types';
import {
  formatChatRecord,
  getActivationStep,
  suggestedSavedLinkQuestion,
  type SavedLinkPreview,
  type SearchResultPreview,
} from './chat/chat-message';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChatAnswer } from './chat/chat-answer';
import { ChatComposer } from './chat/chat-composer';
import { getChatTurns, followUpQuestions } from './chat/chat-turn';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Image from 'next/image';
import { extractSharedHttpUrl } from '@/lib/share-target';
import { LinkPreviewArtwork } from '@/components/LinkPreviewArtwork';

const SearchResultCard = ({ result }: { result: SearchResultPreview }) => {
  return (
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
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </span>
        <span className="mt-1 block truncate text-xs text-gray-300">
          {new URL(result.url).hostname}
        </span>
      </span>
    </a>
  );
};

const SearchResultCards = memo(({ results }: { results: SearchResultPreview[] }) => {
  if (results.length === 0) return null;

  return (
    <div className="saved-link-results mt-3" aria-label="Saved link search results">
      <p className="mb-2 text-xs font-medium text-muted-foreground">Links in this turn</p>
      <div className="saved-link-results-grid">
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
});

const SavedLinkMoment = ({
  saved,
  onAsk,
  disabled,
}: {
  saved: SavedLinkPreview;
  onAsk: (question: string, savedLinkId: string) => void;
  disabled: boolean;
}) => {
  const captureStatus = saved.contentScope === 'metadata-only'
    ? 'Only the title and metadata were available.'
    : saved.contentScope === 'partial-preview'
      ? 'A public preview was saved; the full post may be unavailable.'
      : saved.hasContent
        ? 'Text was saved for later questions.'
        : 'Title and description saved; source text was unavailable.';

  return (
    <section
      className="mt-3 overflow-hidden rounded-2xl border border-white/15 bg-[#171717]"
      aria-label="Newly saved link"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="group relative h-28 shrink-0 overflow-hidden sm:h-auto sm:w-36" aria-hidden="true">
          <LinkPreviewArtwork url={saved.url} imgPreview={saved.imgPreview} />
        </div>
        <div className="min-w-0 flex-1 p-4">
          <p className="text-xs font-medium text-emerald-300">Saved to your library</p>
          <a
            href={saved.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block line-clamp-2 font-semibold text-white underline-offset-2 hover:underline focus-visible:underline"
          >
            {saved.title}
          </a>
          {saved.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-gray-300">
              {saved.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-gray-400">{captureStatus}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <p className="text-xs text-gray-400">Try asking about what you saved.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onAsk(suggestedSavedLinkQuestion(), saved.id)}
          className="min-h-10 gap-2"
        >
          Ask about this link
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
};

// Memoized list to avoid re-rendering the whole chat on each keystroke
export const ChatConversation = memo(
  ({
    messages,
    isBotTyping,
    messagesEndRef,
    onAskSavedLink,
  }: {
    messages: Message[];
    isBotTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onAskSavedLink: (question: string, savedLinkId: string) => void;
  }) => {
    const turns = useMemo(() => getChatTurns(messages), [messages]);
    return (
      <div className="space-y-8" aria-label="Conversation">
        {turns.map((turn, index) => {
          if (turn.kind === 'user') return (
            <section key={turn.id} className="flex justify-end" aria-label="Your message">
              <div className="max-w-[90%] min-w-0 rounded-2xl rounded-br-md border border-white/10 bg-[#1A1A1A] px-4 py-3 sm:max-w-[85%]">
                <p className="whitespace-pre-wrap break-words text-sm leading-6 [overflow-wrap:anywhere]">{turn.text}</p>
              </div>
            </section>
          );
          const isLast = index === turns.length - 1;
          const working = isLast && isBotTyping;
          const followUpId = turn.contextLinkId ?? turn.saved?.id;
          return (
            <section key={turn.id} className="min-w-0" aria-label="DoryAI response">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true"><LinkIcon className="h-3.5 w-3.5" /></span>
                DoryAI
              </div>
              {turn.activity && !turn.warnings.includes(turn.activity) ? (
                <p className="mb-3 flex items-center gap-2 text-xs text-gray-400" role={working ? 'status' : undefined}>
                  {working ? <Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" aria-hidden="true" /> : <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  {turn.activity}
                </p>
              ) : null}
              {turn.warnings.map((warning) => (
                <p key={warning} className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-amber-200" role="status">{warning}</p>
              ))}
              {turn.texts.map((text, textIndex) => <ChatAnswer key={textIndex} text={text} sources={turn.sources} />)}
              {turn.saved ? <SavedLinkMoment saved={turn.saved} onAsk={onAskSavedLink} disabled={isBotTyping} /> : null}
              <SearchResultCards results={turn.sources} />
              {turn.sources.length ? (
                <nav className="mt-3 flex flex-wrap gap-2" aria-label="Saved link references">
                  {turn.sources.map((source, sourceIndex) => (
                    <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" title={source.title}
                      className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <span className="text-gray-500" aria-hidden="true">{sourceIndex + 1}</span>
                      <span className="truncate">{new URL(source.url).hostname}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="sr-only">: {source.title}</span>
                    </a>
                  ))}
                </nav>
              ) : null}
              {isLast && !working && turn.texts.length > 0 && followUpId ? (
                <div className="mt-4 flex flex-wrap gap-2" aria-label="Ask a follow-up about this saved link">
                  {followUpQuestions.map(({ label, question }) => (
                    <Button key={label} type="button" variant="outline" size="sm" className="min-h-10 rounded-full border-white/10 bg-transparent text-xs text-gray-300" onClick={() => onAskSavedLink(question, followUpId)}>{label}<ArrowRight className="h-3 w-3" aria-hidden="true" /></Button>
                  ))}
                </div>
              ) : null}
              {working && !turn.activity ? <p className="mt-3 flex items-center gap-2 text-xs text-gray-400" role="status"><Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" aria-hidden="true" />Working on your request…</p> : null}
            </section>
          );
        })}
        {isBotTyping && turns.at(-1)?.kind !== 'assistant' ? (
          <p className="flex items-center gap-2 text-sm text-gray-400" role="status"><Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />Working on your request…</p>
        ) : null}
        <div ref={messagesEndRef} />
      </div>
    );
  },
);

const Chat = () => {
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<Id<'chatSessions'> | null>(null);
  const [sessionError, setSessionError] = useState(false);
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<{
    text: string;
    savedLinkId?: string;
  } | null>(
    null,
  );
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const getOrCreateSession = useMutation(api.chat.getOrCreateSession);
  const clearHistory = useMutation(api.chat.clearHistory);
  const processMessage = useAction(api.ai.processChatMessage);

  // Initial session load
  useEffect(() => {
    let active = true;
    setSessionError(false);
    void getOrCreateSession({})
      .then((session) => {
        if (active && session) setSessionId(session._id);
      })
      .catch(() => {
        if (active) setSessionError(true);
      });
    return () => {
      active = false;
    };
  }, [getOrCreateSession, sessionAttempt]);

  const rawMessages = useQuery(
    api.chat.getMessages,
    sessionId ? { sessionId } : 'skip',
  );
  const hasSavedLinks = useQuery(api.links.hasSavedLinks);

  // Convert Convex messages to UI Message type
  const messages = useMemo<Message[]>(
    () => {
      const formattedMessages: Message[] = [];
      for (const message of rawMessages ?? []) {
        const text = formatChatRecord(message);
        if (!text) continue;
        formattedMessages.push({
          id: message._id,
          text,
          parts: message.parts as any,
          sender: message.role === 'user' ? 'user' : 'bot',
          role: message.role as any,
          contextLinkId: message.contextLinkId,
        });
      }
      return formattedMessages;
    },
    [rawMessages],
  );

  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const deferredMessages = useDeferredValue(messages);
  const activationStep = useMemo(
    () => getActivationStep(rawMessages ?? [], hasSavedLinks === true),
    [rawMessages, hasSavedLinks],
  );

  const startFirstSave = () => {
    setInput('Save this link: ');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const startFirstSearch = () => {
    setInput('Find my saved link about ');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedUrl = extractSharedHttpUrl(
      searchParams.get('shared_url'),
    );
    const shareError = searchParams.get('share_error');
    if (!sharedUrl && shareError !== 'missing_url') return;

    if (sharedUrl) {
      setInput(`Save this link: ${sharedUrl}`);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      toast.error('No web link was found in the shared content.');
    }
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }, [messages, isBotTyping]);

  const sendMessage = useCallback(async (
    messageToSend: string,
    clearInput: boolean,
    savedLinkId?: string,
  ) => {
    if (!messageToSend.trim() || isBotTyping || !sessionId) return;

    setIsBotTyping(true);
    setRequestError(null);
    setLastFailedMessage(null);
    if (clearInput) setInput('');

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await processMessage({
        message: messageToSend,
        sessionId,
        timeZone,
        ...(savedLinkId ? { savedLinkId: savedLinkId as Id<'links'> } : {}),
      });
    } catch {
      setRequestError("DoryAI couldn't finish that request.");
      setLastFailedMessage({ text: messageToSend, savedLinkId });
    } finally {
      setIsBotTyping(false);
    }
  }, [isBotTyping, processMessage, sessionId]);

  const handleSendMessage = (customInput?: string) =>
    sendMessage(customInput ?? input, customInput === undefined);

  const handleAskSavedLink = useCallback((question: string, savedLinkId: string) => {
    void sendMessage(question, false, savedLinkId);
  }, [sendMessage]);

  const handleClearChat = async () => {
    if (!sessionId || isClearingHistory) return;

    setIsClearingHistory(true);
    try {
      const result = await clearHistory({ sessionId });
      setClearDialogOpen(false);
      toast.success(
        result.deletedCount === 1
          ? '1 chat message cleared'
          : `${result.deletedCount} chat messages cleared`,
      );
    } catch {
      toast.error('Failed to clear history');
    } finally {
      setIsClearingHistory(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {messages.length === 0 ? (
        // Blank State
        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-20 fade-in zoom-in duration-500">
          <div className="mb-8 relative opacity-80">
            <Image
              src="/isologo.png"
              width={260}
              height={48}
              alt="DoryAI"
              className="opacity-10"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 text-center">
            {hasSavedLinks === undefined
              ? 'Getting your library ready…'
              : hasSavedLinks
                ? 'Your saved links are ready'
                : 'Save a link you want to remember'}
          </h1>
          <p className="max-w-xl text-[#A5A5A5] text-base md:text-lg mb-6 text-center">
            {hasSavedLinks
              ? 'Ask DoryAI to find or explain something you saved, or add another link.'
              : 'Add a useful webpage, video, or supported post. DoryAI will show what it saved, then you can ask about it in your own words.'}
          </p>

          {hasSavedLinks === false ? (
            <ol
              className="mb-8 flex items-center gap-3 text-sm text-[#A5A5A5]"
              aria-label="Getting started"
            >
              <li className="rounded-full border border-white/20 px-3 py-1 text-white">
                1. Save
              </li>
              <li aria-hidden="true">→</li>
              <li className="rounded-full border border-white/20 px-3 py-1">
                2. Find it
              </li>
            </ol>
          ) : null}

          <div className="flex flex-wrap justify-center gap-3">
            {hasSavedLinks ? (
              <Button
                type="button"
                onClick={startFirstSearch}
                disabled={!sessionId || isBotTyping}
                className="rounded-full h-10 px-6"
              >
                Find a saved link
              </Button>
            ) : null}
            <Button
              variant="outline"
              type="button"
              className="bg-[#141414] border-[#1D1D1D] hover:bg-[#1D1D1D] text-[#A5A5A5] hover:text-white rounded-full h-10 px-6 gap-2"
              onClick={startFirstSave}
              disabled={hasSavedLinks === undefined || !sessionId || isBotTyping}
            >
              <LinkIcon className="h-4 w-4" />
              {hasSavedLinks ? 'Add another link' : 'Add a link'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <header className="px-4 h-12 flex items-center shrink-0 border-b border-[#1D1D1D]">
            <div className="mx-auto flex w-full max-w-[720px] items-center justify-between gap-3">
              <p className="text-xs text-[#A5A5A5]" role="status">
                {activationStep === 'save' &&
                  'Step 1 of 2: send a link to save it.'}
                {activationStep === 'ready' &&
                  'Ask DoryAI about any link you saved.'}
                {activationStep === 'retrieve' &&
                  'Step 2 of 2: ask DoryAI to find that link.'}
                {activationStep === 'complete' &&
                  'Your library, in conversation.'}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setClearDialogOpen(true)}
                    disabled={
                      !sessionId ||
                      messages.length === 0 ||
                      isBotTyping ||
                      isClearingHistory
                    }
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Clear chat history</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear chat history</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>
          <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
            <DialogContent className="sm:max-w-md rounded-xl border border-[#2A2A2A] bg-[#1D1D1D] text-[#E5E5E5]">
              <DialogHeader>
                <DialogTitle>Clear chat history?</DialogTitle>
                <DialogDescription className="text-[#A5A5A5]">
                  This permanently removes this conversation. Your saved links
                  will not be affected.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:space-x-0">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isClearingHistory}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isClearingHistory}
                  onClick={() => void handleClearChat()}
                >
                  {isClearingHistory ? 'Clearing…' : 'Clear history'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[720px] px-4 py-6">
              <ChatConversation
                messages={deferredMessages}
                isBotTyping={isBotTyping}
                messagesEndRef={messagesEndRef}
                onAskSavedLink={handleAskSavedLink}
              />
            </div>
          </div>
        </>
      )}

      <div className="sticky bottom-0 z-10 border-t border-[#1D1D1D] bg-[#0A0A0A]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/60">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        <div className="relative mx-auto w-full max-w-[720px] px-4 py-4 pt-3 pb-[calc(8px+env(safe-area-inset-bottom))]">
          {(sessionError || requestError) && (
            <div
              className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-100"
              role="alert"
            >
              <span>
                {sessionError ? 'Chat could not start.' : requestError}
              </span>
              {sessionError ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSessionAttempt((attempt) => attempt + 1)}
                >
                  Try again
                </Button>
              ) : lastFailedMessage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBotTyping || !sessionId}
                  onClick={() => void sendMessage(
                    lastFailedMessage.text,
                    false,
                    lastFailedMessage.savedLinkId,
                  )}
                >
                  Try again
                </Button>
              ) : null}
            </div>
          )}
          <ChatComposer value={input} onChange={setInput} onSend={() => { void handleSendMessage(); }} inputRef={inputRef} working={isBotTyping} disabled={isBotTyping || !sessionId} />
        </div>
      </div>
    </div>
  );
};
export default Chat;
