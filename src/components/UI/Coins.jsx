// src/components/UI/Coins.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Coins = ({ amount }) => {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      className="flex items-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-lg"
    >
      <span className="text-2xl">🪙</span>
      <span className="text-white font-bold">{amount}</span>
    </motion.div>
  );
};

export default Coins;