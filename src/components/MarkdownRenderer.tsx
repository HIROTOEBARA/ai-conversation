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
          // ===== 見出し系 =====
          h1: ({ children, ...props }) => (
            <h1 className="mt-2 mb-3 text-xl font-bold text-slate-900" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="mt-4 mb-2 text-lg font-semibold text-slate-900" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="mt-3 mb-2 text-base font-semibold text-slate-900" {...props}>
              {children}
            </h3>
          ),

          // ===== 段落系 =====
          p: ({ children, ...props }) => (
            <p className="my-2 text-slate-900" {...props}>
              {children}
            </p>
          ),

          // ===== 箇条書き =====
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

          // ===== 引用 =====
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-3 border-l-4 border-slate-300 bg-slate-50 px-3 py-2 text-slate-800"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // ===== リンク =====
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

          // ===== コード =====
          code: ({ children, className, ...props }) => {
            const isBlock = /language-/.test(className || "");
            if (!isBlock) {
              // インラインコード
              return (
                <code
                  className="rounded bg-slate-100 px-1 py-0.5 text-[0.95em] text-slate-900"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // ブロックコード
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

          // ===== 区切り線 =====
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

          // ===== ここから「表」まわり =====
          table: ({ children, ...props }) => (
            <div className="my-3 overflow-x-auto">
              <table
                className="min-w-full border-collapse border border-slate-300 text-sm"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-slate-100" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
          tr: ({ children, ...props }) => (
            <tr className="even:bg-slate-50" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-slate-300 px-3 py-1 text-left text-xs font-semibold text-slate-900"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-slate-300 px-3 py-1 align-top text-xs text-slate-900"
              {...props}
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}