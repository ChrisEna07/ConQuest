// src/components/Game/GameHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Coins from '../UI/Coins';
import LevelProgress from '../UI/LevelProgress';

const GameHeader = ({ 
  theme, 
  userName, 
  coins, 
  gameMode, 
  currentRound, 
  totalQuestions, 
  currentQuestion,
  correctStreak,
  currentTitle,
  onProfileClick, 
  onStoreClick,
  playSound 
}) => {
  
  // Calcular progreso de la ronda actual (0-100)
  const questionsPerRound = 10;
  const questionInRound = currentQuestion % questionsPerRound;
  const roundProgress = totalQuestions > 0 ? ((questionInRound) / questionsPerRound) * 100 : 0;
  
  // Calcular rondas totales (máximo 3)
  const totalRounds = Math.ceil(totalQuestions / questionsPerRound);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/10 backdrop-blur-lg shadow-lg z-40 flex-shrink-0"
    >
      <div className="container mx-auto px-4 py-2 sm:py-3">
        {/* Fila superior */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Logo y nombre de usuario */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-base sm:text-lg md:text-xl font-bold text-white truncate"
            >
              ConquestQuestion
            </motion.h1>
            {gameMode === 'single' && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/80 text-xs sm:text-sm truncate"
              >
                👤 {userName}
              </motion.span>
            )}
          </div>
          
          {/* Monedas y botones */}
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between">
            <Coins amount={coins} />
            
            {/* Indicador de ronda */}
            <div className="hidden sm:block bg-purple-500/30 px-3 py-1 rounded-full text-xs text-white">
              Ronda {currentRound}/{totalRounds}
            </div>
            
            <div className="flex space-x-1 sm:space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onProfileClick();
                  playSound('click');
                }}
                className="text-white hover:text-yellow-300 transition-colors text-xs sm:text-sm px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                title="Perfil"
              >
                <span className="hidden xs:inline">👤 Perfil</span>
                <span className="xs:hidden">👤</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onStoreClick();
                  playSound('click');
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all text-xs sm:text-sm"
                title="Tienda"
              >
                <span className="hidden xs:inline">🛒 Tienda</span>
                <span className="xs:hidden">🛒</span>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Barra de progreso del nivel (solo en modo individual) */}
        {gameMode === 'single' && <LevelProgress />}
        
        {/* Barra de progreso de la ronda */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Ronda {currentRound}</span>
            <span>Pregunta {questionInRound + 1}/{questionsPerRound}</span>
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${roundProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Indicadores de racha y título */}
        {gameMode === 'single' && (
          <div className="flex justify-end mt-1 space-x-3">
            <span className="text-xs text-yellow-400 flex items-center gap-1">
              <span>🔥</span> {correctStreak}
            </span>
            <span className="text-xs text-purple-400 flex items-center gap-1">
              <span>🏆</span> {currentTitle}
            </span>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default GameHeader;