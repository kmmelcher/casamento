"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Vaquinha } from "@/lib/types";

const PIX_KEY = "83986650905";

function PixKey() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-gray-500">Chave PIX (telefone)</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">{PIX_KEY}</p>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 rounded-lg bg-gray-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-gray-800 transition"
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

type ContributionModalProps = {
  vaquinha: Vaquinha;
  open: boolean;
  onClose: () => void;
};

export function ContributionModal({
  vaquinha,
  open,
  onClose,
}: ContributionModalProps) {
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
          Contribuir para: {vaquinha.title}
        </h3>
        <p className="text-gray-500 text-sm mt-2">
          Contribua com qualquer valor via PIX. Escaneie o QR code abaixo ou use
          a chave PIX.
        </p>

        <div className="mt-5 flex flex-col items-center">
          <div className="relative w-52 h-52 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/pix-qrcode.svg"
              alt="QR Code PIX"
              fill
              className="object-contain p-2"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Escaneie o QR code para pagar via PIX
          </p>
        </div>

        <PixKey />

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </dialog>
  );
}
