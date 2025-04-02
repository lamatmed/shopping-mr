"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { MainNav } from "./main-nav";
import { Menu, X } from "lucide-react"; // Icônes menu
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext)!;
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav
      className="p-4 bg-gray-300 shadow-md flex items-center justify-between"
      style={{
        backgroundImage: "url('/uda.jpg')", // Remplace par ton image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo + Menu mobile */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image src={"/union.jpg"} alt="logo" width={70} height={70} />
        </Link>
        <a
          href="/activités"
          className="text-sm font-bold text-blue-600 hover:text-blue-900 bg-white p-1 rounded"
        >
          Activités
        </a>

        {/* Bouton Menu Mobile */}
        <button
          className="md:hidden p-2 rounded-md text-black hover:bg-gray-200 transition bg-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Desktop */}
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-300 shadow-lg flex flex-col p-4 space-y-3 md:hidden">
          <MainNav />
          {!isAuthenticated && (
            <>
              <Button
                onClick={() => {
                  router.push("/register");
                  setMenuOpen(false);
                }}
                className="bg-white text-blue-600 w-full"
              >
                S&apos;inscrire
              </Button>
              <Button
                onClick={() => {
                  router.push("/login");
                  setMenuOpen(false);
                }}
                className="bg-white text-blue-600 w-full"
              >
                Se connecter
              </Button>
            </>
          )}
        </div>
      )}

      {/* Menu déroulant utilisateur */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-blue-600 flex items-center space-x-2"
            >
              <Image
                src={user.photo && user.photo !== "" ? user.photo : "/R.png"}
                alt={`Photo de ${user.name}`}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <div className="flex items-center space-x-2">
                  <Image
                    src={user.photo && user.photo !== "" ? user.photo : "/R.png"}
                    alt={`Photo de ${user.name}`}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      Connecté en tant que {user.role}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="cursor-pointer text-red-500"
              >
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      ) : (
        // Boutons "Se connecter" et "S'inscrire" uniquement si l'utilisateur n'est pas connecté
        <div className="hidden md:flex space-x-3">
          <Button
            onClick={() => router.push("/register")}
            className="bg-white text-blue-600"
          >
            S&apos;inscrire
          </Button>
          <Button
            onClick={() => router.push("/login")}
            className="bg-white text-blue-600"
          >
            Se connecter
          </Button>
        </div>
      )}
    </nav>
  );
}
