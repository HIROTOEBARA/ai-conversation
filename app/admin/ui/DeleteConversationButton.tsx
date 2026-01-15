// app/admin/ui/DeleteConversationButton.tsx
import { deleteConversationAction } from "../actions";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";

type Props = {
  id: string;
};

export function DeleteConversationButton({ id }: Props) {
  return (
    <form action={deleteConversationAction} className="flex items-center">
      <input type="hidden" name="id" value={id} />
      <ConfirmSubmitButton
        label="削除"
        confirmMessage="この投稿を削除しますか？（元に戻せません）"
        className="rounded-md border border-red-400/30 bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/30"
      />
    </form>
  );
}