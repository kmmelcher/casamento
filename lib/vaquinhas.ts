import type { Vaquinha } from "./types";
import vaquinhasData from "@/data/vaquinhas.json";
import { getVaquinhasFromDb } from "./db";

export async function getVaquinhas(): Promise<Vaquinha[]> {
  try {
    return await getVaquinhasFromDb();
  } catch {
    return vaquinhasData as Vaquinha[];
  }
}
