// src/components/UI/LevelProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const LevelProgress = () => {
  const { level, experience, currentTitle, correctStreak, maxStreak } = useGame();
  
  // Calcular progreso (asegurar que no exceda el 100%)
  const expNeeded = level * 100;
  const progress = Math.min((experience / expNeeded) * 100, 100);
  
  // Determinar color según el progreso
  const getProgressColor = () => {
    if (progress >= 80) return 'from-green-400 to-green-600';
    if (progress >= 50) return 'from-yellow-400 to-yellow-600';
    if (progress >= 20) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className="mt-2 sm:mt-3 space-y-2">
      {/* Información del jugador */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-white/80">Nivel {level}</span>
          <span className="text-white/40">|</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text font-semibold">
            {currentTitle}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400">🔥 {correctStreak}</span>
          <span className="text-blue-400">📊 {maxStreak}</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="relative w-full h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Marcadores de hitos */}
        <div className="absolute inset-0 flex justify-between px-1">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className={`w-0.5 h-full ${
                progress >= mark ? 'bg-white/30' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Experiencia actual */}
      <div className="flex justify-between text-xs text-white/60">
        <span>{experience} XP actuales</span>
        <span>{expNeeded} XP necesarios</span>
      </div>
    </div>
  );
};

export default LevelProgress;