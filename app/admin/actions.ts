"use server";

import { revalidatePath } from "next/cache";
import { verifyIdToken } from "@/lib/firebase-admin";
import {
  isUserAdmin,
  getGiftsFromDb,
  insertGiftToDb,
  deleteGiftFromDb,
  getVaquinhasFromDb,
  insertVaquinhaToDb,
  deleteVaquinhaFromDb,
} from "@/lib/db";
import type { Gift, Vaquinha } from "@/lib/types";

type ActionResult = { success: true } | { success: false; error: string };

async function authenticateAdmin(idToken: string) {
  try {
    const decoded = await verifyIdToken(idToken);
    const admin = await isUserAdmin(decoded.uid);
    if (!admin) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function checkAdmin(idToken: string): Promise<boolean> {
  try {
    const decoded = await verifyIdToken(idToken);
    return await isUserAdmin(decoded.uid);
  } catch {
    return false;
  }
}

export async function getAdminGifts(idToken: string): Promise<Gift[]> {
  if (!(await authenticateAdmin(idToken))) return [];
  try {
    return await getGiftsFromDb();
  } catch {
    return [];
  }
}

export async function getAdminVaquinhas(
  idToken: string
): Promise<Vaquinha[]> {
  if (!(await authenticateAdmin(idToken))) return [];
  try {
    return await getVaquinhasFromDb();
  } catch {
    return [];
  }
}

export async function addGift(
  idToken: string,
  title: string,
  description: string,
  imageUrl?: string
): Promise<ActionResult> {
  if (!(await authenticateAdmin(idToken))) {
    return { success: false, error: "Acesso negado." };
  }
  try {
    const id = `gift-${Date.now()}`;
    await insertGiftToDb(id, title, description, imageUrl);
    revalidatePath("/presentes");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao adicionar presente." };
  }
}

export async function removeGift(
  idToken: string,
  id: string
): Promise<ActionResult> {
  if (!(await authenticateAdmin(idToken))) {
    return { success: false, error: "Acesso negado." };
  }
  try {
    await deleteGiftFromDb(id);
    revalidatePath("/presentes");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao excluir presente." };
  }
}

export async function addVaquinha(
  idToken: string,
  title: string,
  description: string,
  imageUrl?: string
): Promise<ActionResult> {
  if (!(await authenticateAdmin(idToken))) {
    return { success: false, error: "Acesso negado." };
  }
  try {
    const id = `vaquinha-${Date.now()}`;
    await insertVaquinhaToDb(id, title, description, imageUrl);
    revalidatePath("/vaquinhas");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao adicionar vaquinha." };
  }
}

export async function removeVaquinha(
  idToken: string,
  id: string
): Promise<ActionResult> {
  if (!(await authenticateAdmin(idToken))) {
    return { success: false, error: "Acesso negado." };
  }
  try {
    await deleteVaquinhaFromDb(id);
    revalidatePath("/vaquinhas");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao excluir vaquinha." };
  }
}
