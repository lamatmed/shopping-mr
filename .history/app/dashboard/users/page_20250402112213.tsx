'use client';

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import { deleteUser, getAllUsers, updateUser } from "@/utils/actions";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import Image from "next/image";

const UsersPage = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [user?.role, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers(); // Récupère tous les utilisateurs
        setAllUsers(usersList);
        setTotalUsers(usersList.length); // Stocke le nombre total d'utilisateurs
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les utilisateurs.",
          variant: "destructive",
        });
      }
    };
    fetchUsers();
  }, [toast]);

  const handleEditUser = async (userId: string, updatedData: any) => {
    try {
      await updateUser(userId, updatedData);
      setAllUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedData } : user))
      );
      toast({ title: "Utilisateur modifié", description: "Informations mises à jour avec succès." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de modifier cet utilisateur.", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setTotalUsers((prevTotal) => prevTotal - 1);
      toast({ title: "Utilisateur supprimé", description: "L'utilisateur a été supprimé avec succès." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer cet utilisateur.", variant: "destructive" });
    }
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const users = allUsers.slice(startIndex, endIndex);

  const filteredUsers = users.filter((user) => user.nni.includes(search));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestion des Utilisateurs</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Numéro Téléphone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="ml-4 text-gray-600">Total : {totalUsers}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-md hover:shadow-lg">
                <CardHeader>
                  <CardTitle>
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      defaultValue={user.name}
                      onBlur={(e) => handleEditUser(user.id, { name: e.target.value })}
                    />
                  </CardTitle>

                  <Image
  src={user.photo || '/lok.jpg'}
  alt={`Photo de ${user.name}`}
  width={12}
  height={12}
  className="rounded-full"
  onError={(e) => e.currentTarget.src = '/lok.jpg'}  // Si l'image ne se charge pas, on remplace par l'image par défaut
/>

                  <CardDescription>
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      defaultValue={user.nni}
                      onBlur={(e) => handleEditUser(user.id, { nni: e.target.value })}
                    />
                  </CardDescription>
                  <CardDescription className="text-blue-500">
                    <select
                      className="border p-2 rounded w-full"
                      defaultValue={user.role}
                      onChange={(e) => handleEditUser(user.id, { role: e.target.value as Role })}
                    >
                      <option value="USER">Utilisateur</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="password"
                      className="border p-1 rounded w-full"
                      placeholder="Nouveau mot de passe"
                      onBlur={(e) => handleEditUser(user.id, { password: e.target.value })}
                    />
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Précédent
        </Button>

        <span>Page {currentPage} / {Math.ceil(totalUsers / usersPerPage)}</span>

        <Button disabled={endIndex >= totalUsers} onClick={() => setCurrentPage(currentPage + 1)}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default UsersPage;
