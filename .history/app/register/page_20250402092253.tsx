"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
import { User, Lock, Phone } from "lucide-react";
export default function RegisterPage() {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/"); // Redirection vers l'accueil
    }
  }, [user, router]);

  const [userp, setUser] = useState({
    nni: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: Role.USER,
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...userp, [name]: name === "role" ? (value as Role) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (userp.password !== userp.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userp),
      });

      if (!res.ok)
        throw new Error("Inscription échouée l'utilisateur existe déja");
      const newUser = await res.json();

      toast({
        title: "Inscription réussie",
        description: `Bienvenue ${newUser.name}!`,
      });

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-sm shadow-lg bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Inscription
          </CardTitle>
          <CardDescription className="text-center text-black">
            Créez un compte pour accéder à l&apos; application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <Input
                name="name"
                placeholder="Nom"
                onChange={handleChange}
                required
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              <Input
                name="nni"
                placeholder="Numéro Téléphone"
                onChange={handleChange}
                required
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              <Input
                name="password"
                type="password"
                placeholder="Mot de passe"
                onChange={handleChange}
                required
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirmer le mot de passe"
                onChange={handleChange}
                required
                className="pl-10"
              />
            </div>
            <select
              name="role"
              value={userp.role}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-gray-100"
            >
              <option value={Role.USER}>Utilisateur</option>
            </select>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
            <p className="text-center text-sm mt-2">
                    Vous avez déjà un compte ?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                             Se connecter
                        </a>
             </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
