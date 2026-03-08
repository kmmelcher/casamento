import { getVaquinhas } from "@/lib/vaquinhas";
import { VaquinhaCard } from "../components/VaquinhaCard";

export default async function VaquinhasPage() {
  const vaquinhas = await getVaquinhas();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-6">
          Contribua com qualquer valor para itens especiais. O pagamento é feito
          via PIX.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaquinhas.map((vaquinha) => (
            <li key={vaquinha.id}>
              <VaquinhaCard vaquinha={vaquinha} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
