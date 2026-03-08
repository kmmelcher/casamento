"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/app/components/AuthProvider";
import {
  getUserReservations,
  unreserveGift,
  type UserReservationItem,
} from "@/app/actions";

export default function ReservationsPage() {
  const { user, loading: authLoading, signInWithGoogle, getIdToken } = useAuth();
  const [items, setItems] = useState<UserReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    const token = await getIdToken();
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await getUserReservations(token);
    setItems(data);
    setLoading(false);
  }, [getIdToken]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReservations();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, user, fetchReservations]);

  async function handleRemove(giftId: string) {
    const token = await getIdToken();
    if (!token) return;
    setRemovingId(giftId);
    const result = await unreserveGift(giftId, token);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.reservation.gift_id !== giftId));
    }
    setRemovingId(null);
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Entre para ver suas reservas
        </h2>
        <p className="text-gray-600 mt-2">
          Você precisa estar conectado com o Google para ver seus presentes reservados.
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 rounded-lg bg-gray-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Nenhuma reserva ainda
        </h2>
        <p className="text-gray-600 mt-2">
          Navegue pela lista de presentes e clique em um presente para reservá-lo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Minhas Reservas
      </h2>
      <ul className="space-y-4">
        {items.map(({ gift, reservation }) => (
          <li
            key={reservation.gift_id}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            {gift.imageUrl ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={gift.imageUrl}
                  alt={gift.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-xs">
                Sem imagem
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {gift.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {gift.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Reservado em{" "}
                {new Date(reservation.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <button
              onClick={() => handleRemove(reservation.gift_id)}
              disabled={removingId === reservation.gift_id}
              className="shrink-0 rounded-lg border border-red-200 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
            >
              {removingId === reservation.gift_id ? "Removendo…" : "Remover"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
