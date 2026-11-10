import Markdown from "react-markdown";

export function MarkdownView({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className="markdown">
      <Markdown
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                {children}
              </a>
            );
          },
        }}
      >
        {source}
      </Markdown>
    </div>
  );
}
