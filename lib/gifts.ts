import type { Gift } from "./types";
import giftsData from "@/data/gifts.json";

export function getGifts(): Gift[] {
  return giftsData as Gift[];
}
