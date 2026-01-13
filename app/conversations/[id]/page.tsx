import { notFound } from "next/navigation";
import { parseTaggedChat } from "@/lib/parseTaggedChat";
import { getConversationById, listConversations } from "@/lib/conversationRepo";
import ConversationDetailClient from "./ConversationDetailClient";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ category?: string }>;
};

export async function generateStaticParams() {
  const conversations = await listConversations();
  return conversations.map((c) => ({ id: c.id }));
}

export default async function ConversationDetailPage({ params, searchParams }: Props) {
  const { id } = await params;

  const sp = (await searchParams) ?? {};
  const category = sp.category;
  const backHref = category
    ? `/conversations?category=${encodeURIComponent(category)}`
    : "/conversations";

  const conversation = await getConversationById(id);
  if (!conversation) notFound();

  const parsed = parseTaggedChat(conversation.taggedText);

  const date = new Date(conversation.created_at);
  const formatted = date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ConversationDetailClient
      id={id}
      backHref={backHref}
      header={{
        formatted,
        title: conversation.title,
        summary: conversation.summary,
        category: conversation.category ?? "全て",
      }}
      parsedOk={parsed.ok}
      parsedError={parsed.ok ? undefined : parsed.error}
      messages={parsed.ok ? parsed.messages : []}
    />
  );
}