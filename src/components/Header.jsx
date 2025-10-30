"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { eliminarToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/lib/services/loginSevice";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState();
  const router = useRouter();
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Corregido: prevenir propagación para que toggleUserMenu funcione correctamente
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  };

  const handleLogout = () => {
    eliminarToken();
    router.replace("/login");
  };

  const getUser = async () => {
    const response = await fetchUserData();
    if (response.success) {
      console.log(response.data);
      setUserName(response.data.username);
    } else {
      console.error("Error fetching user data:", response.message);
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full z-30 top-0 left-0">
      <div className="mx-auto px-4 sm:px-7 lg:px-4">
        <div className="flex justify-between h-18 items-center">
          {/* LOGO */}
          <div className="flex items-center h-full">
            <Link href="/home" className="flex items-center">
              <Image
                src="/images/logo_operadora.png"
                alt="Logo"
                width={0}
                height={0}
                sizes="(max-width: 568px) 150px, 250px"
                className="h-10 md:h-13 w-auto"
                priority
              />
            </Link>
          </div>

          {/* BOTÓN BURGER (solo móvil) */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* LINKS DESKTOP */}
          <div className="hidden md:flex space-x-6">
            <Link
              href="/home"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/perfil"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Perfil
            </Link>
          </div>

          {/* MENÚ USUARIO */}
          <div className="relative hidden md:flex items-center space-x-4" ref={menuRef}>
            {/* Nombre de usuario */}
            <span className="text-[#004b73ff] font-semibold">{userName}</span>

            {/* Botón del menú */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="text-[#004b73ff] flex items-center hover:text-[#F98A38] focus:outline-none"
              >
                <User size={22} />
              </button>

              {/* Menú desplegable alineado al borde del navbar */}
              <div
                className={`fixed right-0 top-18 w-80 bg-white rounded-b-md shadow-lg border-t-0 py-2 z-50 transform transition-all duration-300 ease-in-out
                  ${
                    showUserMenu
                      ? "opacity-100 scale-100 translate-x-0"
                      : "opacity-0 scale-95 translate-x-4 pointer-events-none"
                  }`}
              >
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="space-y-2 px-4 py-3">
            <Link
              href="/home"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/dashboard"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/perfil"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-600 hover:bg-gray-50 px-2 py-2 font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
