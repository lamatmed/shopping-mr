import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mon_secret_jwt";
export async function GET(req: Request) {
  try {
    // Vérifier la présence du token
    const authHeader = req.headers.get("Authorization");
    console.log("Token reçu:", authHeader); // 🔍 Vérifie si le token est bien reçu

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Accès refusé, token manquant." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Vérifier et décoder le token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
      console.log("Token décodé:", decoded); // 🔍 Vérifie le contenu du token
    } catch (err) {
      return NextResponse.json({ message: "Token invalide ou expiré." }, { status: 403 });
    }

    // Vérifier que l'ID utilisateur est bien présent
    if (!decoded.id) {
      console.log("ID utilisateur manquant dans le token");
      return NextResponse.json({ message: "Token invalide, ID utilisateur manquant." }, { status: 403 });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: decoded.id as string },
      select: { id: true, name: true, role: true },
    });

    console.log("Utilisateur trouvé dans la base de données:", user); // 🔍 Vérifie si l'utilisateur est trouvé

    if (!user) {
      return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
  }
}
