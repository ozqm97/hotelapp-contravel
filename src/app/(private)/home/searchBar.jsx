"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TabHoteles from "./tabs/tabsHoteles";
import TabSeguros from "./tabs/tabsSeguros";

const tabsConfig = [
  { id: "hoteles", label: "Hoteles", Component: TabHoteles },
  { id: "seguros", label: "Seguros", Component: TabSeguros },
];

export default function SearchTabs() {
  const [activeTab, setActiveTab] = useState("hoteles");
  const tabRefs = useRef({});
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      const { offsetLeft, offsetWidth } = currentTab;
      setSliderStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div
      className="w-full flex justify-center items-center py-20 bg-cover bg-center"
    >
      <div className="max-w-6xl w-full bg-white bg-opacity-80 rounded-xl shadow-lg border border-gray-200 p-8 mx-6">
        
        {/* TABS */}
        <div className="relative flex justify-center mb-8 border-b border-gray-200">
          {tabsConfig.map(({ id, label }) => (
            <button
              key={id}
              ref={(el) => (tabRefs.current[id] = el)}
              onClick={() => setActiveTab(id)}
              className={`px-6 py-2 font-semibold rounded-t-lg transition-all ${
                activeTab === id
                  ? "text-[#004b73ff]"
                  : "text-gray-500 hover:text-[#004b73ff]"
              }`}
            >
              {label}
            </button>
          ))}

          {/* Border Slider Animado */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-0 h-1 bg-[#004b73ff]"
            style={{
              left: sliderStyle.left,
              width: sliderStyle.width,
            }}
          />
        </div>

        {/* Contenido de las pestañas con animación */}
        <AnimatePresence mode="wait">
          {tabsConfig.map(
            ({ id, Component }) =>
              activeTab === id && (
                <motion.div
                  key={id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                  transition={{ duration: 0.3 }}
                >
                  <Component />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
