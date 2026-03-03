// src/components/UI/Toast.jsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Posiciones disponibles para los toasts
const positions = [
  'bottom-8 left-1/2 -translate-x-1/2', // Centro
  'bottom-8 left-8', // Izquierda
  'bottom-8 right-8', // Derecha
  'top-24 left-1/2 -translate-x-1/2', // Centro superior
  'top-24 left-8', // Superior izquierda
  'top-24 right-8', // Superior derecha
];

const Toast = ({ message, type = 'success', onClose, duration = 3000, position = 0 }) => {
  const timerRef = useRef(null);
  const positionClass = positions[position % positions.length];

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, onClose]);

  const icons = {
    success: '🎉',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
    coin: '🪙',
    title: '🏆',
    levelup: '⭐',
    boost: '⚡',
    streak: '🔥'
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    info: 'from-blue-500 to-cyan-600',
    warning: 'from-yellow-500 to-amber-600',
    coin: 'from-yellow-400 to-amber-500',
    title: 'from-purple-500 to-pink-600',
    levelup: 'from-indigo-500 to-purple-600',
    boost: 'from-orange-500 to-red-600',
    streak: 'from-orange-400 to-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`fixed ${positionClass} z-50`}
    >
      <div className={`bg-gradient-to-r ${colors[type]} text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center space-x-2 sm:space-x-3 min-w-[250px] sm:min-w-[300px] max-w-md border border-white/20 backdrop-blur-sm`}>
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl"
        >
          {icons[type]}
        </motion.span>
        <p className="font-semibold flex-1 text-xs sm:text-sm md:text-base">{message}</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            onClose();
          }}
          className="text-white/80 hover:text-white text-lg sm:text-xl"
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration || 3000}
          position={index} // Cada toast tiene una posición diferente basada en su índice
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AnimatePresence>
  );
};

export default Toast;