// src/components/Game/RoundPause.jsx
import React from 'react';
import { motion } from 'framer-motion';

const RoundPause = ({ round, stats, onContinue, onGoToStore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-2xl mx-auto h-full flex items-center justify-center"
    >
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20 text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🏁
        </motion.div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          ¡Ronda {round} Completada!
        </h2>
        
        <p className="text-white/80 text-lg mb-6">
          Tómate un descanso y prepárate para la siguiente ronda
        </p>

        {/* Estadísticas de la ronda */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-500/20 rounded-lg p-4">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-white font-bold text-xl">{stats.correct}</div>
            <div className="text-white/60 text-sm">Correctas</div>
          </div>
          
          <div className="bg-red-500/20 rounded-lg p-4">
            <div className="text-3xl mb-1">❌</div>
            <div className="text-white font-bold text-xl">{stats.incorrect}</div>
            <div className="text-white/60 text-sm">Incorrectas</div>
          </div>
          
          <div className="bg-yellow-500/20 rounded-lg p-4">
            <div className="text-3xl mb-1">🪙</div>
            <div className="text-white font-bold text-xl">{stats.coinsEarned}</div>
            <div className="text-white/60 text-sm">Ganadas</div>
          </div>
        </div>

        {/* Mensaje según el desempeño */}
        <div className="mb-8">
          {stats.correct >= 8 ? (
            <p className="text-green-300 font-semibold">🌟 ¡Excelente ronda! Sigue así</p>
          ) : stats.correct >= 5 ? (
            <p className="text-yellow-300 font-semibold">👍 Buena ronda, puedes mejorar</p>
          ) : (
            <p className="text-blue-300 font-semibold">💪 La próxima ronda será mejor</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            Continuar a Ronda {round + 1}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoToStore}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            🛒 Ir a la Tienda
          </motion.button>
        </div>

        <p className="text-white/40 text-sm mt-4">
          La tienda está disponible para que compres mejoras entre rondas
        </p>
      </div>
    </motion.div>
  );
};

export default RoundPause;