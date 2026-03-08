import type { Gift } from "./types";
import giftsData from "@/data/gifts.json";
import { getGiftsFromDb } from "./db";

export async function getGifts(): Promise<Gift[]> {
  try {
    return await getGiftsFromDb();
  } catch {
    return giftsData as Gift[];
  }
}
