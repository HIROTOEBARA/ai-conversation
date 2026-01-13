// src/components/ChatThread.tsx
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import type { Message } from "@/lib/parseTaggedChat";

type Props = {
  messages: Message[];
};

export function ChatThread({ messages }: Props) {
  return (
    <section className="space-y-4">
      {messages.map((m, idx) => {
        const isUser = m.role === "user";

        return (
          <div
            key={idx}
            className={["flex w-full", isUser ? "justify-end" : "justify-start"].join(" ")}
          >
            <div
              className={[
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                "break-words",
                isUser
                  // ✅ user: 明るい背景 + 読みやすい文字
                  ? "bg-sky-50 text-slate-900 border border-sky-200"
                  // ✅ assistant: 白背景 + 枠線（読みやすい）
                  : "bg-white text-slate-900 border border-slate-200",
              ].join(" ")}
            >
              <MarkdownRenderer content={m.body} />
            </div>
          </div>
        );
      })}
    </section>
  );
}