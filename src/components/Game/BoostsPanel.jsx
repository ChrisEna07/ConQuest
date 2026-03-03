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
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg"
      >
        🚀
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 0 }}
            className="absolute bottom-16 left-0 bg-white/10 backdrop-blur-lg rounded-lg p-3 min-w-[200px]"
          >
            <h3 className="text-white font-bold mb-2 text-sm">Tus Boosts</h3>
            <div className="space-y-2">
              {availableBoosts.map(([key, boost]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onUseBoost(key);
                    setIsOpen(false);
                  }}
                  className="w-full bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg flex items-center justify-between text-sm transition-colors"
                  disabled={boost.active}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{boost.icon}</span>
                    <span>{boost.name}</span>
                  </span>
                  <span className="bg-yellow-500/30 px-2 py-1 rounded-full text-xs">
                    x{boost.quantity}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoostsPanel;