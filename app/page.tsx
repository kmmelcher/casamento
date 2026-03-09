import Link from "next/link";
import Image from "next/image";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/home-page.jpg"
          alt="Kilian & Viviane"
          fill
          priority
          className="object-cover opacity-30"
        />

        <div className="relative z-10 text-center px-4">
          <h1
            className={`${greatVibes.className} text-5xl sm:text-7xl md:text-8xl text-gray-900 leading-tight`}
          >
            Casamento
            <br />
            Kilian &amp; Viviane
          </h1>
          <p className="mt-6 text-xl sm:text-2xl tracking-[0.3em] text-gray-700 font-light">
            09 · 05 · 2026
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* Message & Links Section */}
      <section className="bg-stone-50 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-4 flex justify-center gap-2 text-stone-300">
            <span className="block w-12 h-px bg-stone-300 self-center" />
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="block w-12 h-px bg-stone-300 self-center" />
          </div>

          <p className="text-lg sm:text-xl text-stone-600 leading-relaxed">
            Se você planeja nos presentear, acesse a nossa lista de presentes ou
            contribua com nossa vaquinha. Mas fique à vontade, não é
            obrigatório. O maior presente para nós é ter você celebrando conosco
            na nossa festa.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/presentes"
              className="inline-block rounded-full border-2 border-stone-800 bg-stone-800 text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Acesse a lista de presentes
            </Link>
            <Link
              href="/presentes#vaquinha"
              className="inline-block rounded-full border-2 border-stone-800 text-stone-800 px-8 py-3 text-sm font-medium tracking-wide hover:bg-stone-800 hover:text-white transition-colors"
            >
              Contribua com nossa vaquinha
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
