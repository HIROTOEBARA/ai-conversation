// src/components/MarkdownRenderer.tsx
"use client";

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

          // ✅ 段落
          p: ({ children, ...props }) => (
            <p className="my-2 text-slate-900 leading-relaxed" {...props}>
              {children}
            </p>
          ),

          // ✅ 箇条書き（入れ子も崩れにくく）
          ul: ({ children, ...props }) => (
            <ul className="my-2 list-disc pl-5 text-slate-900 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-2 list-decimal pl-5 text-slate-900 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-slate-900 leading-relaxed" {...props}>
              {children}
            </li>
          ),

          // ✅ 引用（今回必須ではないが崩れ防止）
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-3 border-l-4 border-slate-300 bg-slate-50 px-3 py-2 text-slate-800"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // ✅ URL / リンク
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-sky-700 underline underline-offset-2 hover:text-sky-800 break-words"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),

          // ✅ コード：inline / block を "inline" フラグで判定（ここが重要）
          pre: ({ children, ...props }) => (
            <pre
              className="my-3 overflow-x-auto rounded-lg bg-slate-100 p-3 text-[0.9em] text-slate-900"
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ inline, children, ...props }) => {
            if (inline) {
              return (
                <code
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.95em] text-slate-900"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            // block の場合は pre 側で見た目を持つので、code 自体は素でOK
            return <code {...props}>{children}</code>;
          },

          // ✅ 表（ここが今回の最重要）
          table: ({ children, ...props }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-slate-100" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-slate-200 px-3 py-2 text-left font-semibold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-slate-200 px-3 py-2 align-top" {...props}>
              {children}
            </td>
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