"use client";

import { useEffect, useRef, useState } from "react";
import type { Gift } from "@/lib/types";

type ReservationModalProps = {
  gift: Gift;
  open: boolean;
  onClose: () => void;
  onConfirm: (message: string) => Promise<void>;
};

export function ReservationModal({
  gift,
  open,
  onClose,
  onConfirm,
}: ReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
      await onConfirm(message);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
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
          Reservar este presente?
        </h3>
        <p className="text-gray-600 mt-2">
          Você está prestes a reservar{" "}
          <span className="font-medium text-gray-900">{gift.title}</span>. Isso
          vai marcá-lo como escolhido para que ninguém mais possa selecioná-lo.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Você pode remover sua reserva depois na página Minhas Reservas.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Deixe uma mensagem para nós (opcional)"
          rows={3}
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-gray-900 text-white py-2.5 px-4 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {loading ? "Reservando…" : "Confirmar"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </dialog>
  );
}
