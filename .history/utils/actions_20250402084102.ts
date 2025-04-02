"use server";

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

// Gestion des utilisateurs
export const createUser = async (data: { nni: string; password: string; name: string; role?: "ADMIN" | "USER" }) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const updateUser = async (
  id: string,
  data: Partial<{ nni: string; password: string; name: string; role: "ADMIN" | "USER" }>
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("L'utilisateur n'existe pas.");

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({ where: { id } });
};

// Gestion des produits
export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      user: { // Include user data based on the relation
        select: {
          name: true, // Include user name
          nni: true, // Include user NNI
        },
      },
    },
  });
}

export async function createProduct(
  data: { name: string; quantity: number; price_v: number; imageUrl?: string },
  userId: string
) {
  return await prisma.product.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateProduct(
  id: string,
  data: { name: string; quantity: number; price_v: number; imageUrl?: string },
  userId: string,
  userRole: "ADMIN" | "USER"
) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Produit introuvable.");

  // Vérification des droits
  if (product.userId !== userId && userRole !== "ADMIN") {
    throw new Error("Action non autorisée.");
  }

  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string, userId: string, userRole: "ADMIN" | "USER") {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Produit introuvable.");

  // Vérification des droits
  if (product.userId !== userId && userRole !== "ADMIN") {
    throw new Error("Action non autorisée.");
  }

  return await prisma.product.delete({ where: { id } });
}
