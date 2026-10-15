import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownNode {
  type: string;
  value?: string;
  children?: MarkdownNode[];
}

// A rendering boundary, not a prompt-only promise. Also covers URLs in code.
const noInlineUrls = () => (tree: MarkdownNode) => {
  const visit = (node: MarkdownNode) => {
    if (typeof node.value === 'string') {
      node.value = node.value
        .replace(/\b(?:URL:\s*)?(?:https?:\/\/|www\.)[^\s<>`]+/gi, '')
        .replace(/\bURL:\s*$/gi, '');
    }
    node.children?.forEach(visit);
  };
  visit(tree);
};

/** Link destinations live on cards. Model-generated images are never loaded. */
export const AssistantAnswer = ({ text }: { text: string }) => (
  <div className="prose prose-invert max-w-none break-words [overflow-wrap:anywhere]">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, noInlineUrls]}
      components={{
        a: ({ children }) => <span>{children}</span>,
        img: () => null,
      }}
    >
      {text}
    </ReactMarkdown>
  </div>
);
