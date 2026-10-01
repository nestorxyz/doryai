import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { SearchResultPreview } from './chat-message';

const markdownPlugins = [remarkGfm];

export const ChatAnswer = ({ text, sources }: {
  text: string;
  sources: SearchResultPreview[];
}) => (
  <div className="chat-answer">
    <ReactMarkdown
      remarkPlugins={markdownPlugins}
      components={{
        a: ({ href, children }) => {
          let url: URL;
          try {
            url = new URL(href ?? '');
            if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
              return <span>{children}</span>;
            }
          } catch {
            return <span>{children}</span>;
          }
          const source = sources.find((item) => item.url === href);
          const rawUrl = typeof children === 'string' && /^https?:\/\//.test(children);
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" title={source?.title ?? href}>
              {rawUrl ? source?.title ?? url.hostname : children}
            </a>
          );
        },
        table: ({ children }) => <div className="overflow-x-auto"><table>{children}</table></div>,
      }}
    >
      {text}
    </ReactMarkdown>
  </div>
);
