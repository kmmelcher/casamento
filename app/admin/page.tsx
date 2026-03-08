"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import {
  checkAdmin,
  getAdminGifts,
  getAdminVaquinhas,
  addGift,
  removeGift,
  addVaquinha,
  removeVaquinha,
} from "./actions";
import type { Gift, Vaquinha } from "@/lib/types";

type Tab = "gifts" | "vaquinhas";

export default function AdminPage() {
  const { user, loading, getIdToken, signInWithGoogle } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("gifts");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [vaquinhas, setVaquinhas] = useState<Vaquinha[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    (async () => {
      const token = await getIdToken();
      if (!token || cancelled) return;
      const admin = await checkAdmin(token);
      if (!cancelled) setIsAdmin(admin);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading, getIdToken]);

  const loadData = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;
    setDataLoading(true);
    try {
      const [g, v] = await Promise.all([
        getAdminGifts(token),
        getAdminVaquinhas(token),
      ]);
      setGifts(g);
      setVaquinhas(v);
    } finally {
      setDataLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setError("");
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Título e descrição são obrigatórios.");
      return;
    }
    const token = await getIdToken();
    if (!token) return;
    setSubmitting(true);
    setError("");
    try {
      const action = tab === "gifts" ? addGift : addVaquinha;
      const result = await action(
        token,
        title.trim(),
        description.trim(),
        imageUrl || undefined
      );
      if (result.success) {
        resetForm();
        await loadData();
      } else {
        setError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const label = tab === "gifts" ? "presente" : "vaquinha";
    if (!confirm(`Excluir ${label}?`)) return;
    const token = await getIdToken();
    if (!token) return;
    setDeleting(id);
    try {
      const action = tab === "gifts" ? removeGift : removeVaquinha;
      await action(token, id);
      await loadData();
    } finally {
      setDeleting(null);
    }
  };

  // ── Loading / Auth states ──────────────────────────────────────

  if (loading || (isAdmin === null && user)) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Faça login para acessar o painel administrativo.
          </p>
          <button
            onClick={signInWithGoogle}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Entrar com Google
          </button>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 font-medium">Acesso negado.</p>
      </main>
    );
  }

  // ── Admin panel ────────────────────────────────────────────────

  const items: (Gift | Vaquinha)[] =
    tab === "gifts" ? gifts : vaquinhas;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Painel Administrativo
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setTab("gifts");
              resetForm();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === "gifts"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            Presentes ({gifts.length})
          </button>
          <button
            onClick={() => {
              setTab("vaquinhas");
              resetForm();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === "vaquinhas"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            Vaquinhas ({vaquinhas.length})
          </button>
        </div>

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            + Adicionar {tab === "gifts" ? "presente" : "vaquinha"}
          </button>
        )}

        {/* Add form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-6 bg-white rounded-xl border shadow-sm space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Adicionar {tab === "gifts" ? "presente" : "vaquinha"}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Nome do item"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                rows={3}
                placeholder="Descrição do item"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem (URL)
              </label>
              <input
                type="url"
                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ou upload de imagem (máx. 2 MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-600"
              />
            </div>

            {imageUrl && (
              <div className="flex items-center gap-2">
                <div className="w-32 h-24 relative rounded overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-gray-400 hover:text-red-600 transition text-lg"
                  aria-label="Remover imagem"
                >
                  ✕
                </button>
              </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
              >
                {submitting ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Items list */}
        {dataLoading ? (
          <div className="animate-pulse text-gray-400">Carregando...</div>
        ) : items.length === 0 ? (
          <p className="text-gray-500">Nenhum item encontrado.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm"
              >
                {item.imageUrl ? (
                  <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-12 rounded bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-xs">
                    —
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {item.description}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 shrink-0"
                >
                  {deleting === item.id ? "..." : "Excluir"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
