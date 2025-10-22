"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const goToHome = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/home");
    }, 300);
  };

  return (
    <div className="w-full max-w-3xl bg-white/10 p-10 rounded-2xl shadow-xl text-center">
      <h1 className="text-4xl font-bold mb-4">📊 Panel de Control</h1>
      <p className="text-lg mb-6">
        Aquí puedes ver información general, estadísticas y accesos rápidos.
      </p>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white/20 p-6 rounded-xl shadow hover:bg-white/30 transition">
          <h2 className="text-xl font-semibold">Usuarios</h2>
          <p className="text-sm mt-2">32 activos</p>
        </div>

        <div className="bg-white/20 p-6 rounded-xl shadow hover:bg-white/30 transition">
          <h2 className="text-xl font-semibold">Reservas</h2>
          <p className="text-sm mt-2">124 procesadas</p>
        </div>

        <div className="bg-white/20 p-6 rounded-xl shadow hover:bg-white/30 transition">
          <h2 className="text-xl font-semibold">Ingresos</h2>
          <p className="text-sm mt-2">$15,430 MXN</p>
        </div>

        <div className="bg-white/20 p-6 rounded-xl shadow hover:bg-white/30 transition">
          <h2 className="text-xl font-semibold">Alertas</h2>
          <p className="text-sm mt-2">2 pendientes</p>
        </div>
      </div>

      <button
        onClick={goToHome}
        disabled={loading}
        className="mt-10 bg-blue-700 hover:bg-blue-800 font-semibold py-2 px-6 rounded-lg transition disabled:opacity-60"
      >
        {loading ? "Regresando..." : "← Volver al Home"}
      </button>
    </div>
  );
}
