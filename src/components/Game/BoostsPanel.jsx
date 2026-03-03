// src/components/Game/BoostsPanel.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const BoostsPanel = ({ onUseBoost }) => {
  const { boosts } = useGame();
  const [isOpen, setIsOpen] = React.useState(false);

  const availableBoosts = Object.entries(boosts).filter(([_, boost]) => boost.quantity > 0);

  if (availableBoosts.length === 0) return null;

  return (
    <div className="fixed top-20 sm:top-24 right-2 sm:right-4 z-50">
      {/* Botón principal */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all relative group"
        title="Activar boost"
      >
        <span className="text-xl sm:text-2xl">🚀</span>
        {availableBoosts.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {availableBoosts.length}
          </span>
        )}
      </motion.button>

      {/* Panel desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 0 }}
            className="absolute top-14 right-0 sm:right-0 bg-white/10 backdrop-blur-lg rounded-lg p-3 min-w-[220px] sm:min-w-[250px] border border-white/20 shadow-2xl"
          >
            <h3 className="text-white font-bold mb-2 text-sm sm:text-base">⚡ Tus Boosts</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {availableBoosts.map(([key, boost]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onUseBoost(key);
                    setIsOpen(false);
                  }}
                  className="w-full bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-lg flex items-center justify-between text-xs sm:text-sm transition-colors border border-white/10 hover:border-white/30"
                  disabled={boost.active}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">{boost.icon}</span>
                    <span className="font-medium">{boost.name}</span>
                  </span>
                  <span className="bg-yellow-500/30 px-2 py-1 rounded-full text-xs font-bold">
                    x{boost.quantity}
                  </span>
                </motion.button>
              ))}
            </div>
            
            {/* Indicador de boost activo */}
            {Object.values(boosts).some(b => b.active) && (
              <div className="mt-2 pt-2 border-t border-white/20">
                <p className="text-green-300 text-xs flex items-center gap-1">
                  <span className="animate-pulse">⚡</span>
                  Boost activo en pregunta actual
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoostsPanel;