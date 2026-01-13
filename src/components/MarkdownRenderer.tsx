// src/components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="leading-relaxed text-slate-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="mt-2 mb-3 text-xl font-bold text-slate-900"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="mt-4 mb-2 text-lg font-semibold text-slate-900"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="mt-3 mb-2 text-base font-semibold text-slate-900"
              {...props}
            >
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="my-2 text-slate-900" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="my-2 list-disc pl-5 text-slate-900" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-2 list-decimal pl-5 text-slate-900" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="my-1 text-slate-900" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-3 border-l-4 border-slate-300 bg-slate-50 px-3 py-2 text-slate-800"
              {...props}
            >
              {children}
            </blockquote>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-sky-700 underline underline-offset-2 hover:text-sky-800"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          code: ({ children, className, ...props }) => {
            const isBlock = /language-/.test(className || "");
            if (!isBlock) {
              // ✅ インラインコード：暗くならないように明るい背景＋濃い文字
              return (
                <code
                  className="rounded bg-slate-100 px-1 py-0.5 text-[0.95em] text-slate-900"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // ✅ ブロックコード：黒ベタを避け、読みやすいグレー背景に
            return (
              <code
                className="block overflow-x-auto rounded-lg bg-slate-100 p-3 text-[0.9em] text-slate-900"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="my-3 overflow-x-auto" {...props}>
              {children}
            </pre>
          ),
          hr: (props) => <hr className="my-4 border-slate-200" {...props} />,
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-slate-900" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-slate-900" {...props}>
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}