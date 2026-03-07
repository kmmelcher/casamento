"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Wedding Gift List
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <Link
              href="/"
              className={`transition ${pathname === "/" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Gifts
            </Link>
            {user && (
              <Link
                href="/reservations"
                className={`transition ${pathname === "/reservations" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                My Reservations
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
          ) : user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.displayName || user.email}
              </span>
              {user.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={signOut}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-lg bg-gray-900 text-white px-4 py-1.5 text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {user && (
        <nav className="sm:hidden border-t border-gray-100 px-4 py-2 flex gap-4 text-sm font-medium">
          <Link
            href="/"
            className={`transition ${pathname === "/" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Gifts
          </Link>
          <Link
            href="/reservations"
            className={`transition ${pathname === "/reservations" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            My Reservations
          </Link>
        </nav>
      )}
    </header>
  );
}
