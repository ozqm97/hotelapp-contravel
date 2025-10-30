"use client";

import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TabSeguros() {
  const [destino, setDestino] = useState("");
  const [tipoViaje, setTipoViaje] = useState("Un viaje");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const [asegurados, setAsegurados] = useState(1);
  const [edades, setEdades] = useState([""]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(null);

  const inputWidth = 80; // ancho fijo de cada input de edad
  const maxColumns = 3; // máximo columnas horizontales

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ajustar ancho del dropdown según ancho del botón y número de inputs
  useEffect(() => {
    if (buttonRef.current) {
      const totalColumns = Math.min(asegurados, maxColumns);
      const width = totalColumns * inputWidth + (totalColumns - 1) * 16; // gap 16px
      setDropdownWidth(Math.max(buttonRef.current.offsetWidth, width));
    }
  }, [dropdownOpen, asegurados]);

  const actualizarAsegurados = (count) => {
    setAsegurados(count);
    setEdades(Array(count).fill(""));
  };

  const actualizarEdad = (index, value) => {
    const nuevasEdades = [...edades];
    nuevasEdades[index] = value;
    setEdades(nuevasEdades);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados (seguros):", {
      Destino: destino,
      TipoViaje: tipoViaje,
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
      Asegurados: asegurados,
      Edades: edades,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <InputField label="Destino" value={destino} onChange={setDestino} />
        <SelectField
          label="Tipo de viaje"
          value={tipoViaje}
          opciones={["Un viaje", "Múltiples viajes"]}
          onChange={setTipoViaje}
        />
        <DatePickerField
          label="Fecha destino"
          selected={fechaInicio}
          onChange={setFechaInicio}
        />
        <DatePickerField
          label="Fecha fin"
          selected={fechaFin}
          onChange={setFechaFin}
        />

        {/* Dropdown Asegurados */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-600 mb-1">
            Asegurados
          </label>
          <button
            type="button"
            ref={buttonRef}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {asegurados} asegurado{asegurados > 1 ? "s" : ""}
          </button>

          {dropdownOpen && (
            <div
              className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg z-20 shadow-lg p-4 grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(asegurados, maxColumns)}, ${inputWidth}px)`
              }}
            >
              {/* Número de asegurados */}
              <div className={`col-span-full`}>
                <label className="text-sm font-medium block mb-1">
                  Número de asegurados
                </label>
                <select
                  value={asegurados}
                  onChange={(e) => actualizarAsegurados(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                >
                  {[...Array(9)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inputs de edades */}
              {edades.map((edad, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Edad asegurado {i + 1}
                  </label>
                  <input
                    type="number"
                    value={edad}
                    onChange={(e) => actualizarEdad(i, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Edad"
                    min="0"
                    max="120"
                    style={{ width: `${inputWidth}px` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón Buscar */}
        <div className="flex flex-col">
          <button
            type="submit"
            className="bg-[#004b73ff] hover:bg-[#F98A38] text-white font-semibold rounded-lg px-4 py-2 transition-colors w-full"
          >
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
}

// --- COMPONENTES AUXILIARES ---
function InputField({ label, value, onChange }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="text"
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 w-full focus:ring-2 focus:ring-[#004b73ff]"
      />
    </div>
  );
}

function DatePickerField({ label, selected, onChange }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText="Seleccionar fecha"
        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 w-full focus:ring-2 focus:ring-[#004b73ff]"
      />
    </div>
  );
}

function SelectField({ label, value, opciones, onChange }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 w-full focus:ring-2 focus:ring-[#004b73ff]"
      >
        {opciones.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
