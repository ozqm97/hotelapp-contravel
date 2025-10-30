"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { obtenerToken } from "@/lib/auth";

export default function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}
