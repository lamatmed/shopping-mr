"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-300 to-green-700 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Système de Gestion
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Gérez efficacement votre stock et vos utilisateurs.
          </p>
        </motion.div>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Carte Utilisateurs */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Utilisateurs
                </CardTitle>
                <CardDescription>Gestion des utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/users">Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Carte Produits */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBasket className="h-6 w-6" />
                  Produits
                </CardTitle>
                <CardDescription>Gérez tous vos produits</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/allproduits">Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

   
    </main>
  );
}
