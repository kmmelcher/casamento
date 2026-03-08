"use client";

import Image from "next/image";
import { useState } from "react";
import type { Gift } from "@/lib/types";
import type { ReservationRow } from "@/lib/db";
import { reserveGift } from "@/app/actions";
import { useAuth } from "./AuthProvider";
import { ReservationModal } from "./ReservationModal";

type GiftCardProps = {
  gift: Gift;
  reservation: ReservationRow | null;
};

export function GiftCard({ gift, reservation }: GiftCardProps) {
  const { user, signInWithGoogle, getIdToken } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const isReserved = !!reservation;
  const isOwnReservation = user && reservation?.user_uid === user.uid;

  async function handleReserveClick() {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    setModalOpen(true);
  }

  async function handleConfirmReservation() {
    const token = await getIdToken();
    if (!token) throw new Error("Not authenticated");
    const result = await reserveGift(gift.id, token);
    if (!result.success) throw new Error(result.error);
  }

  return (
    <>
      <article
        className={`rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col transition h-full ${
          isReserved
            ? "border-gray-200 opacity-75"
            : "border-gray-200 hover:shadow-md hover:border-gray-300 cursor-pointer"
        }`}
        onClick={!isReserved ? handleReserveClick : undefined}
        role={!isReserved ? "button" : undefined}
        tabIndex={!isReserved ? 0 : undefined}
        onKeyDown={
          !isReserved
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleReserveClick();
                }
              }
            : undefined
        }
      >
        {gift.imageUrl ? (
          <div className="relative aspect-[4/3] bg-gray-100">
            <Image
              src={gift.imageUrl}
              alt={gift.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isReserved && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  Reservado
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Sem imagem
            {isReserved && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  Reservado
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{gift.title}</h2>
          <p className="text-gray-600 text-sm mt-1 flex-1">
            {gift.description}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100">
            {isReserved ? (
              <p className="text-sm text-gray-500 text-center">
                {isOwnReservation
                  ? "Você reservou este presente"
                  : "Já reservado"}
              </p>
            ) : (
              <p className="text-sm text-gray-900 font-medium text-center">
                Clique para reservar
              </p>
            )}
          </div>
        </div>
      </article>

      <ReservationModal
        gift={gift}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmReservation}
      />
    </>
  );
}
