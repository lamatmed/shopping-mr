import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assurez-vous d'avoir ce fichier pour initialiser Prisma
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { nni, password, name, role } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { nni, password: hashedPassword, name, role  },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
