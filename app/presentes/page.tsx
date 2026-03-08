import { getGifts } from "@/lib/gifts";
import { getReservationsMap } from "@/lib/db";
import { GiftCard } from "../components/GiftCard";

export default async function PresentsPage() {
  const [gifts, reservationsMap] = await Promise.all([
    Promise.resolve(getGifts()),
    getReservationsMap(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-6">
          Escolha um presente e clique para reservar.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <li key={gift.id}>
              <GiftCard
                gift={gift}
                reservation={reservationsMap[gift.id] ?? null}
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
