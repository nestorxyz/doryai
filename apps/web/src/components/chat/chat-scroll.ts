// scrollIntoView also scrolls overflow-hidden ancestors. Only move the chat's
// own viewport so incoming records cannot displace the panel or composer.
export const scrollChatToLatest = (
  viewport: Pick<HTMLDivElement, 'scrollHeight' | 'scrollTo'> | null,
  reducedMotion: boolean,
): void => {
  viewport?.scrollTo({
    top: viewport.scrollHeight,
    behavior: reducedMotion ? 'instant' : 'smooth',
  });
};
