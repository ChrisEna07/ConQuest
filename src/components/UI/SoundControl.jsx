// src/components/UI/SoundControl.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const SoundControl = () => {
  const { soundEnabled, toggleSound } = useGame();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleSound}
      className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-lg p-3 rounded-full z-50"
    >
      {soundEnabled ? '🔊' : '🔇'}
    </motion.button>
  );
};

export default SoundControl;