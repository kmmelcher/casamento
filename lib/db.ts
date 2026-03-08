import { neon } from "@neondatabase/serverless";
import type { Gift, Vaquinha } from "./types";

function getSql() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("POSTGRES_URL is not set");
  return neon(url);
}

export type ReservationRow = {
  id: number;
  gift_id: string;
  user_uid: string;
  user_email: string | null;
  reserved_by: string;
  message: string | null;
  created_at: Date;
};

export async function getReservationsMap(): Promise<
  Record<string, ReservationRow>
> {
  try {
    const sql = getSql();
    const rows =
      await sql`SELECT id, gift_id, user_uid, user_email, reserved_by, message, created_at FROM reservations`;
    const map: Record<string, ReservationRow> = {};
    for (const row of rows as ReservationRow[]) {
      map[row.gift_id] = row;
    }
    return map;
  } catch {
    return {};
  }
}

export async function getReservationsByUser(
  userUid: string
): Promise<ReservationRow[]> {
  try {
    const sql = getSql();
    const rows =
      await sql`SELECT id, gift_id, user_uid, user_email, reserved_by, message, created_at FROM reservations WHERE user_uid = ${userUid} ORDER BY created_at DESC`;
    return rows as ReservationRow[];
  } catch {
    return [];
  }
}

export async function insertReservation(
  giftId: string,
  userUid: string,
  userEmail: string | null,
  reservedBy: string,
  message?: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO reservations (gift_id, user_uid, user_email, reserved_by, message)
      VALUES (${giftId}, ${userUid}, ${userEmail}, ${reservedBy}, ${message ?? null})
    `;
    return { success: true };
  } catch (err) {
    if (!process.env.POSTGRES_URL) {
      return { success: false, error: "Banco de dados não configurado." };
    }
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        success: false,
        error: "Este presente já foi reservado.",
      };
    }
    return {
      success: false,
      error: "Falha ao reservar presente. Por favor, tente novamente.",
    };
  }
}

export async function deleteReservation(
  giftId: string,
  userUid: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const sql = getSql();
    const result = await sql`
      DELETE FROM reservations WHERE gift_id = ${giftId} AND user_uid = ${userUid}
    `;
    if (result.length === 0 && (result as { count?: number }).count === 0) {
      return { success: false, error: "Reserva não encontrada." };
    }
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Falha ao remover reserva. Por favor, tente novamente.",
    };
  }
}

// ── User functions ──────────────────────────────────────────────────

export async function upsertUser(
  uid: string,
  email: string | null,
  displayName: string | null
): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO users (uid, email, display_name)
      VALUES (${uid}, ${email}, ${displayName})
      ON CONFLICT (uid) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name
    `;
  } catch {
    // users table may not exist yet — silent fail
  }
}

export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT is_admin FROM users WHERE uid = ${uid}`;
    return rows.length > 0 && rows[0].is_admin === true;
  } catch {
    return false;
  }
}

// ── Gift DB functions ───────────────────────────────────────────────

export async function getGiftsFromDb(): Promise<Gift[]> {
  const sql = getSql();
  const rows = await sql`SELECT id, title, description, image_url FROM gifts ORDER BY created_at ASC`;
  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    imageUrl: (row.image_url as string) || undefined,
  }));
}

export async function insertGiftToDb(
  id: string,
  title: string,
  description: string,
  imageUrl?: string
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO gifts (id, title, description, image_url)
    VALUES (${id}, ${title}, ${description}, ${imageUrl ?? null})
  `;
}

export async function deleteGiftFromDb(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM reservations WHERE gift_id = ${id}`;
  await sql`DELETE FROM gifts WHERE id = ${id}`;
}

// ── Vaquinha DB functions ───────────────────────────────────────────

export async function getVaquinhasFromDb(): Promise<Vaquinha[]> {
  const sql = getSql();
  const rows = await sql`SELECT id, title, description, image_url FROM vaquinhas ORDER BY created_at ASC`;
  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    imageUrl: (row.image_url as string) || undefined,
  }));
}

export async function insertVaquinhaToDb(
  id: string,
  title: string,
  description: string,
  imageUrl?: string
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO vaquinhas (id, title, description, image_url)
    VALUES (${id}, ${title}, ${description}, ${imageUrl ?? null})
  `;
}

export async function deleteVaquinhaFromDb(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM vaquinhas WHERE id = ${id}`;
}
