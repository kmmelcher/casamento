"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Gift } from "@/lib/types";
import type { ReservationRow } from "@/lib/db";
import { reserveGift } from "@/app/actions";
import { useAuth } from "./AuthProvider";
import { BaseCard } from "./BaseCard";
import { ReservationModal } from "./ReservationModal";

type GiftCardProps = {
  gift: Gift;
  reservation: ReservationRow | null;
};

export function GiftCard({ gift, reservation }: GiftCardProps) {
  const { user, signInWithGoogle, getIdToken } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const isReserved = !!reservation;
  const isOwnReservation = user && reservation?.user_uid === user.uid;

  async function handleReserveClick() {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    setModalOpen(true);
  }

  async function handleConfirmReservation(message: string) {
    const token = await getIdToken();
    if (!token) throw new Error("Not authenticated");
    const result = await reserveGift(gift.id, token, message || undefined);
    if (!result.success) throw new Error(result.error);
    router.refresh();
  }

  const badge = isReserved ? (
    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
      <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
        Reservado
      </span>
    </div>
  ) : null;

  const footer = isReserved ? (
    <p className="text-sm text-gray-500 text-center">
      {isOwnReservation ? "Você reservou este presente" : "Já reservado"}
    </p>
  ) : (
    <p className="text-sm text-gray-900 font-medium text-center">
      Clique para reservar
    </p>
  );

  return (
    <>
      <BaseCard
        title={gift.title}
        description={gift.description}
        imageUrl={gift.imageUrl}
        badge={badge}
        footer={footer}
        onClick={!isReserved ? handleReserveClick : undefined}
        disabled={isReserved}
      />

      <ReservationModal
        gift={gift}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmReservation}
      />
    </>
  );
}
