import { getGifts } from "@/lib/gifts";
import { getReservationsMap } from "@/lib/db";
import { GiftCard } from "./components/GiftCard";

export default async function Home() {
  const [gifts, reservationsMap] = await Promise.all([
    Promise.resolve(getGifts()),
    getReservationsMap(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Wedding Gift List
          </h1>
          <p className="text-gray-600 mt-1">
            Choose a gift and reserve it with your name. Each gift can only be
            reserved once.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
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
