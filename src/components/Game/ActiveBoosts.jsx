// src/components/Game/ActiveBoosts.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const ActiveBoosts = () => {
  const { boosts } = useGame();

  const activeBoosts = Object.entries(boosts).filter(([_, boost]) => boost.active);

  if (activeBoosts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {activeBoosts.map(([key, boost]) => (
          <motion.div
            key={key}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <span className="text-2xl">{boost.icon}</span>
            <div>
              <p className="font-bold text-sm">{boost.name} Activo</p>
              <div className="w-full h-1 bg-white/30 rounded-full mt-1">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 10, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ActiveBoosts;