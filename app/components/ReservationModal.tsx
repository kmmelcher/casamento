"use client";

import { useEffect, useRef, useState } from "react";
import type { Gift } from "@/lib/types";

type ReservationModalProps = {
  gift: Gift;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function ReservationModal({
  gift,
  open,
  onClose,
  onConfirm,
}: ReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/40 bg-transparent p-0 m-auto max-w-md w-full"
    >
      <div className="bg-white rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">
          Reserve this gift?
        </h3>
        <p className="text-gray-600 mt-2">
          You are about to reserve{" "}
          <span className="font-medium text-gray-900">{gift.title}</span>. This
          will mark it as taken so no one else can select it.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          You can remove your reservation later from the My Reservations page.
        </p>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-gray-900 text-white py-2.5 px-4 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {loading ? "Reserving…" : "Confirm"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
