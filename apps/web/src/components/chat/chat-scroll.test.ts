import { describe, expect, it, vi } from 'vitest';
import { scrollChatToLatest } from './chat-scroll';

describe('chat viewport scrolling', () => {
  it('scrolls only the conversation viewport after incoming records', () => {
    const scrollTo = vi.fn();
    const outerScrollIntoView = vi.fn();
    const viewport = { scrollHeight: 15832, scrollTo, scrollIntoView: outerScrollIntoView };
    scrollChatToLatest(viewport, false);
    viewport.scrollHeight = 16000;
    scrollChatToLatest(viewport, false);
    expect(scrollTo.mock.calls).toEqual([
      [{ top: 15832, behavior: 'smooth' }],
      [{ top: 16000, behavior: 'smooth' }],
    ]);
    expect(outerScrollIntoView).not.toHaveBeenCalled();
  });

  it('respects reduced motion and tolerates an empty/unmounted viewport', () => {
    const scrollTo = vi.fn();
    scrollChatToLatest({ scrollHeight: 400, scrollTo }, true);
    expect(scrollTo).toHaveBeenCalledWith({ top: 400, behavior: 'instant' });
    expect(() => scrollChatToLatest(null, false)).not.toThrow();
  });
});
