// src/components/UI/Toast.jsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const timerRef = useRef(null);

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
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 50, x: '-50%' }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className={`bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 min-w-[300px] max-w-md`}>
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-3xl"
        >
          {icons[type]}
        </motion.span>
        <p className="font-semibold flex-1 text-sm sm:text-base">{message}</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            onClose();
          }}
          className="text-white/80 hover:text-white"
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
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration || 3000}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AnimatePresence>
  );
};

export default Toast;