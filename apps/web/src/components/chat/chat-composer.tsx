import { useEffect, type RefObject } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const ChatComposer = ({ value, onChange, onSend, inputRef, working, disabled }: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  working: boolean;
  disabled: boolean;
}) => {
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 64), 200)}px`;
  }, [value, inputRef]);

  return (
    <form onSubmit={(event) => { event.preventDefault(); if (!disabled && value.trim()) onSend(); }}>
      <div className="relative rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-sm transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <Textarea
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Message DoryAI"
          aria-describedby="chat-composer-hint"
          name="message"
          autoComplete="off"
          placeholder="Paste a link or ask about your library…"
          className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base min-h-[64px] max-h-[200px] pl-4 pr-16 py-4 resize-none rounded-2xl"
          rows={1}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (!disabled && value.trim()) onSend();
            }
          }}
        />
        <Button type="submit" size="icon" className="absolute bottom-3 right-3 h-10 w-10 rounded-xl" aria-label="Send message" disabled={disabled || !value.trim()}>
          {working ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
      <p id="chat-composer-hint" className="mt-2 flex justify-between gap-3 px-1 text-[11px] text-gray-400">
        <span>Answers use what DoryAI could save.</span>
        <span className="hidden sm:inline">Shift + Enter for a new line</span>
      </p>
    </form>
  );
};
