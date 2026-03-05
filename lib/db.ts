import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("POSTGRES_URL is not set");
  return neon(url);
}

export type ReservationRow = {
  id: number;
  gift_id: string;
  reserved_by: string;
  message: string | null;
  created_at: Date;
};

export async function getReservationsMap(): Promise<Record<string, ReservationRow>> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT id, gift_id, reserved_by, message, created_at FROM reservations`;
    const map: Record<string, ReservationRow> = {};
    for (const row of rows as ReservationRow[]) {
      map[row.gift_id] = row;
    }
    return map;
  } catch {
    return {};
  }
}

export async function insertReservation(
  giftId: string,
  reservedBy: string,
  message?: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO reservations (gift_id, reserved_by, message)
      VALUES (${giftId}, ${reservedBy}, ${message ?? null})
    `;
    return { success: true };
  } catch (err) {
    if (!process.env.POSTGRES_URL) {
      return { success: false, error: "Database is not configured." };
    }
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "This gift has already been reserved." };
    }
    return { success: false, error: "Failed to reserve gift. Please try again." };
  }
}
