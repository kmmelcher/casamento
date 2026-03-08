import type { Vaquinha } from "./types";
import vaquinhasData from "@/data/vaquinhas.json";

export function getVaquinhas(): Vaquinha[] {
  return vaquinhasData as Vaquinha[];
}
