"use client";

import Image from "next/image";
import { useState } from "react";
import type { Gift } from "@/lib/types";
import type { ReservationRow } from "@/lib/db";
import { reserveGift } from "@/app/actions";

type GiftCardProps = {
  gift: Gift;
  reservation: ReservationRow | null;
};

export function GiftCard({ gift, reservation }: GiftCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    const result = await reserveGift(gift.id, name, message || null);
    if (result.success) {
      setStatus("success");
      setName("");
      setMessage("");
      setIsFormOpen(false);
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  const isReserved = !!reservation;

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {gift.imageUrl ? (
        <div className="relative aspect-[4/3] bg-gray-100">
          <Image
            src={gift.imageUrl}
            alt={gift.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{gift.title}</h2>
        <p className="text-gray-600 text-sm mt-1 flex-1">{gift.description}</p>

        {isReserved ? (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              Reserved by {reservation.reserved_by}
            </p>
            {reservation.message && (
              <p className="text-sm text-gray-500 mt-1 italic">
                &ldquo;{reservation.message}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {!isFormOpen ? (
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="w-full rounded-lg bg-gray-900 text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition"
              >
                Reserve this gift
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  disabled={status === "loading"}
                />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Optional message"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  disabled={status === "loading"}
                />
                {errorMessage && (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 rounded-lg bg-gray-900 text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
                  >
                    {status === "loading" ? "Reserving…" : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setErrorMessage("");
                      setStatus("idle");
                    }}
                    disabled={status === "loading"}
                    className="rounded-lg border border-gray-300 py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
