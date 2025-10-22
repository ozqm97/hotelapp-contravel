"use client";

import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TabSeguros() {
  const [destino, setDestino] = useState("");
  const [tipoViaje, setTipoViaje] = useState("Un viaje");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const [pasajeros, setPasajeros] = useState(1);
  const [edades, setEdades] = useState([""]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const edadesRef = useRef([]);
  const cantidadPasajerosRef = useRef(null);
  const dropdownRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(null);

  const columnas = Math.min(3, pasajeros);

  // Ajustar ancho proporcionalmente según número de inputs de edad
  useEffect(() => {
    if (dropdownOpen && edadesRef.current.length > 0) {
      const anchoBase = edadesRef.current[0]?.offsetWidth || 80;

      // Ajuste proporcional
      const factor = 1 + 0.2 * (edades.length - 1);

      setInputWidth(anchoBase * factor);
    }
  }, [dropdownOpen, edades.length]);

  // Detectar click fuera para cerrar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handlePasajerosChange = (count) => {
    setPasajeros(count);
    setEdades(Array(count).fill(""));
  };

  const handleEdadChange = (index, value) => {
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
      Pasajeros: pasajeros,
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
        <DatePickerField label="Fecha destino" selected={fechaInicio} onChange={setFechaInicio} />
        <DatePickerField label="Fecha fin" selected={fechaFin} onChange={setFechaFin} />

        {/* PASAJEROS */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-600 mb-1">Pasajeros</label>
          <button
            type="button"
            className="border border-gray-300 rounded-lg px-3 py-2 text-left w-full"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {pasajeros} pasajero{pasajeros > 1 ? "s" : ""}
          </button>

          {dropdownOpen && (
            <div
              className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg z-20 shadow-lg p-4"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columnas}, minmax(80px, 1fr))`,
                gap: "1rem",
              }}
            >
              {/* Cantidad de pasajeros */}
              <div className={`col-span-${columnas}`}>
                <label className="text-sm font-medium block mb-1">Cantidad de pasajeros</label>
                <select
                  ref={cantidadPasajerosRef}
                  value={pasajeros}
                  onChange={(e) => handlePasajerosChange(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  style={{ width: inputWidth ? `${inputWidth}px` : "100%" }}
                >
                  {[...Array(9)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edades pasajeros */}
              {edades.map((edad, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium">Edad {index + 1}</label>
                  <input
                    ref={(el) => (edadesRef.current[index] = el)}
                    type="number"
                    min="0"
                    max="120"
                    value={edad}
                    onChange={(e) => handleEdadChange(index, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTÓN BUSCAR */}
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
