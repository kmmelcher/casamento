import { getGifts } from "@/lib/gifts";
import { getVaquinhas } from "@/lib/vaquinhas";
import { getReservationsMap } from "@/lib/db";
import { GiftCard } from "../components/GiftCard";
import { VaquinhaCard } from "../components/VaquinhaCard";

export default async function PresentsPage() {
  const [gifts, reservationsMap, vaquinhas] = await Promise.all([
    Promise.resolve(getGifts()),
    getReservationsMap(),
    Promise.resolve(getVaquinhas()),
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

        <section id="vaquinha" className="mt-16 scroll-mt-24">
          <div className="text-center mb-8">
            <div className="mb-3 flex justify-center gap-2 text-stone-300">
              <span className="block w-10 h-px bg-stone-300 self-center" />
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="block w-10 h-px bg-stone-300 self-center" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Não encontrou o presente ideal?
            </h2>
            <p className="mt-2 text-gray-500 max-w-lg mx-auto">
              Sem problemas! Você também pode contribuir com qualquer valor via
              PIX e nos ajudar a montar nosso cantinho.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-6">
            {vaquinhas.map((vaquinha) => (
              <li key={vaquinha.id}>
                <VaquinhaCard vaquinha={vaquinha} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
