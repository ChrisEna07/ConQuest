// src/components/Landing/WelcomeModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WelcomeModal = ({ onStart }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }
    if (name.trim().length > 20) {
      setError('El nombre no puede tener más de 20 caracteres');
      return;
    }
    onStart(name.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          ¡Bienvenido a ConquestQuestion!
        </h2>
        
        <p className="text-white/80 text-center mb-8">
          Para comenzar, dinos cómo quieres que te llamemos
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Tu nombre de jugador"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              autoFocus
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-300 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="flex gap-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white text-indigo-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Comenzar Aventura
            </motion.button>
          </div>
        </form>

        <p className="text-white/60 text-xs text-center mt-4">
          Al continuar, aceptas nuestros términos y condiciones
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeModal;