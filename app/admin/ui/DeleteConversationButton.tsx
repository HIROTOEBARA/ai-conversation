"use client";

import { useTransition } from "react";

type Props = {
  id: string;
  action: (formData: FormData) => Promise<void>; // server action を受け取る
};

export function DeleteConversationButton({ id, action }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const ok = confirm("この投稿を削除しますか？（元に戻せません）");
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-100 hover:bg-red-500/30 disabled:opacity-50"
        onClick={() => {
          // ここは必須じゃないけど、押した瞬間の体感改善（任意）
          startTransition(() => {});
        }}
      >
        削除
      </button>
    </form>
  );
}