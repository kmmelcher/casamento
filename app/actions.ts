"use server";

import { revalidatePath } from "next/cache";
import { insertReservation } from "@/lib/db";

export type ReserveResult =
  | { success: true }
  | { success: false; error: string };

export async function reserveGift(
  giftId: string,
  reservedBy: string,
  message?: string | null
): Promise<ReserveResult> {
  const trimmedName = reservedBy?.trim();
  if (!trimmedName) {
    return { success: false, error: "Please enter your name." };
  }
  const result = await insertReservation(giftId, trimmedName, message ?? null);
  if (result.success) {
    revalidatePath("/");
  }
  return result;
}
