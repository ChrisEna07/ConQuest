// src/components/UI/DeveloperCredit.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DeveloperCredit = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-2 left-2 z-50 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
    >
      <p className="text-xs text-white/60 hover:text-white/90 transition-colors">
        Desarrollado con ❤️ por <span className="font-semibold text-yellow-400">Christian DevR</span>
      </p>
    </motion.div>
  );
};

export default DeveloperCredit;