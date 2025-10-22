export default function Footer() {
  return (
    <footer className="bg-white text-gray-800">
      {/* Sección principal */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col items-center border-t border-gray-200 gap-2">
        
        {/* Links centrados */}
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-[#F98A38] transition-colors">Política</a>
          <a href="#" className="hover:text-[#F98A38] transition-colors">Términos</a>
          <a href="#" className="hover:text-[#F98A38] transition-colors">Contacto</a>
        </div>

        {/* Derechos reservados */}
        <div className="text-xs text-gray-500">
          © 2025 Contravel — Todos los derechos reservados
        </div>
      </div>

      {/* Barra decorativa */}
      <div className="h-1 bg-gradient-to-r from-[#004b73ff] to-[#F98A38]"></div>
    </footer>
  );
}
