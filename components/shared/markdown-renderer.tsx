import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

// Shared renderer for the public Article Body and the admin editor's live
// preview, so what the admin sees matches what visitors get
// (blog-admin-specification.md §3.2, §4.2). No rehype-raw / raw-HTML
// passthrough — react-markdown's default escaping is a deliberate XSS
// boundary (technical-specification.md §5, CLAUDE.md rule 19).
//
// remark-gfm adds tables (owner-approved 2026-10-18). `singleTilde: false`
// keeps "~12,800 MB/s ... ~25,600" style approximations in existing posts
// from turning into strikethrough — only `~~text~~` strikes.
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body text-body text-text-primary">
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Only children are forwarded: column alignment lives on th/td.
          table: ({ children }) => (
            <div className="table-scroll">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
