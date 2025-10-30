"use client";

import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const opcionesHabitaciones = [1, 2, 3, 4];
const opcionesAdultos = [1, 2, 3, 4];
const opcionesNiños = [0, 1, 2, 3];

export default function TabHoteles() {
  const [fechaEntrada, setFechaEntrada] = useState(null);
  const [fechaSalida, setFechaSalida] = useState(null);
  const [habitaciones, setHabitaciones] = useState(1);
  const [detalleHabitaciones, setDetalleHabitaciones] = useState([
    { adultos: 2, niños: 0, edadesNiños: [] },
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actualizarHabitaciones = (count) => {
    setHabitaciones(count);
    setDetalleHabitaciones(
      Array.from({ length: count }, (_, i) =>
        detalleHabitaciones[i] || { adultos: 2, niños: 0, edadesNiños: [] }
      )
    );
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevas = [...detalleHabitaciones];
    if (campo === "adultos" || campo === "niños") {
      nuevas[index][campo] = parseInt(valor);
      if (campo === "niños") {
        nuevas[index].edadesNiños = Array(parseInt(valor)).fill("");
      }
    } else if (campo === "edad") {
      nuevas[index].edadesNiños[valor.subIndex] = valor.value;
    }
    setDetalleHabitaciones(nuevas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados (hoteles):", {
      FechaEntrada: fechaEntrada,
      FechaSalida: fechaSalida,
      Habitaciones: detalleHabitaciones,
    });
  };

  const columnasHabitaciones =
    habitaciones === 1 ? 1 : habitaciones === 2 ? 2 : 2;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
        {/* Destino */}
        <InputField label="Destino" placeholder="Ciudad o hotel" />

        {/* Fecha entrada */}
        <DatePickerField
          label="Entrada"
          selected={fechaEntrada}
          onChange={setFechaEntrada}
        />

        {/* Fecha salida */}
        <DatePickerField
          label="Salida"
          selected={fechaSalida}
          onChange={setFechaSalida}
        />

        {/* Habitaciones */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-600 mb-1">
            Habitaciones
          </label>
          <button
            type="button"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {habitaciones} habitación{habitaciones > 1 ? "es" : ""}
          </button>

          {dropdownOpen && (
<div
  className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg z-20 shadow-lg p-4 grid grid-cols-1 md:grid-cols-[repeat(var(--cols),minmax(250px,1fr))] gap-4"
  style={{ "--cols": columnasHabitaciones }}
>
              {/* Número de habitaciones */}
              <div className="col-span-full">
                <label className="text-sm font-medium block mb-1">
                  Número de habitaciones
                </label>
                <select
                  value={habitaciones}
                  onChange={(e) =>
                    actualizarHabitaciones(parseInt(e.target.value))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                >
                  {opcionesHabitaciones.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detalle habitaciones */}
              {detalleHabitaciones.map((hab, index) => (
                <HabitacionCard
                  key={index}
                  index={index}
                  hab={hab}
                  actualizarDetalle={actualizarDetalle}
                />
              ))}
            </div>
          )}
        </div>

        {/* Botón buscar */}
        <div className="flex flex-col">
          <button
            type="submit"
            className="bg-[#004b73ff] text-white font-semibold rounded-lg px-4 py-2 hover:bg-[#F98A38] transition-colors w-full"
          >
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
}

// --- COMPONENTES AUXILIARES ---
function InputField({ label, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full"
      />
    </div>
  );
}

function DatePickerField({ label, selected, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText="Seleccionar fecha"
        className="border border-gray-300 rounded-lg px-3 py-2 w-full"
      />
    </div>
  );
}

function HabitacionCard({ index, hab, actualizarDetalle }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
      <h4 className="font-semibold text-[#004b73ff] text-lg mb-2">
        Habitación {index + 1}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Adultos"
          value={hab.adultos}
          opciones={[1, 2, 3, 4]}
          onChange={(v) => actualizarDetalle(index, "adultos", v)}
        />
        <SelectField
          label="Niños"
          value={hab.niños}
          opciones={[0, 1, 2, 3]}
          onChange={(v) => actualizarDetalle(index, "niños", v)}
        />
        {hab.niños > 0 && (
          <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
            {hab.edadesNiños.map((edad, i) => (
              <InputField
                key={i}
                label={`Edad niño ${i + 1}`}
                placeholder=""
                value={edad}
                onChange={(v) =>
                  actualizarDetalle(index, "edad", { subIndex: i, value: v })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectField({ label, value, opciones, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full"
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
