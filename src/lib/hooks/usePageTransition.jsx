"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook para manejar transiciones de página.
 * Añade fade-in automáticamente cuando cambias de ruta
 * y quita fade-out.
 */
export default function usePageTransition() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove("fade-out");
    const timeout = setTimeout(() => {
    document.body.classList.add("fade-in");
    }, 20);
    return () => {
      document.body.classList.remove("fade-in");
      clearTimeout(timeout);
    };
  }, [pathname]);
}
