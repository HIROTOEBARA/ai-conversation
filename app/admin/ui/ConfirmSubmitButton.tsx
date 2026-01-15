// app/admin/ui/ConfirmSubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label: string;
  confirmMessage: string;
  className?: string;
};

export function ConfirmSubmitButton({ label, confirmMessage, className }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {pending ? "削除中..." : label}
    </button>
  );
}