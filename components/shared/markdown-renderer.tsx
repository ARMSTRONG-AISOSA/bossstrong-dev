import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

// Shared renderer for the public Article Body and the admin editor's live
// preview, so what the admin sees matches what visitors get
// (blog-admin-specification.md §3.2, §4.2). No rehype-raw / raw-HTML
// passthrough — react-markdown's default escaping is a deliberate XSS
// boundary (technical-specification.md §5, CLAUDE.md rule 19).
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body text-body text-text-primary">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
}
