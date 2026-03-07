"use server";

import { revalidatePath } from "next/cache";
import {
  insertReservation,
  deleteReservation,
  getReservationsByUser,
  type ReservationRow,
} from "@/lib/db";
import { verifyIdToken } from "@/lib/firebase-admin";
import { getGifts } from "@/lib/gifts";
import type { Gift } from "@/lib/types";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

async function authenticateUser(idToken: string) {
  try {
    return await verifyIdToken(idToken);
  } catch {
    return null;
  }
}

export async function reserveGift(
  giftId: string,
  idToken: string
): Promise<ActionResult> {
  const decoded = await authenticateUser(idToken);
  if (!decoded) {
    return { success: false, error: "Authentication failed. Please sign in again." };
  }

  const result = await insertReservation(
    giftId,
    decoded.uid,
    decoded.email ?? null,
    decoded.name ?? decoded.email ?? "Anonymous"
  );

  if (result.success) {
    revalidatePath("/");
    revalidatePath("/reservations");
  }
  return result;
}

export async function unreserveGift(
  giftId: string,
  idToken: string
): Promise<ActionResult> {
  const decoded = await authenticateUser(idToken);
  if (!decoded) {
    return { success: false, error: "Authentication failed. Please sign in again." };
  }

  const result = await deleteReservation(giftId, decoded.uid);
  if (result.success) {
    revalidatePath("/");
    revalidatePath("/reservations");
  }
  return result;
}

export type UserReservationItem = {
  reservation: ReservationRow;
  gift: Gift;
};

export async function getUserReservations(
  idToken: string
): Promise<UserReservationItem[]> {
  const decoded = await authenticateUser(idToken);
  if (!decoded) return [];

  const reservations = await getReservationsByUser(decoded.uid);
  const gifts = getGifts();
  const giftsMap = new Map(gifts.map((g) => [g.id, g]));

  return reservations
    .map((r) => {
      const gift = giftsMap.get(r.gift_id);
      if (!gift) return null;
      return { reservation: r, gift };
    })
    .filter((item): item is UserReservationItem => item !== null);
}
