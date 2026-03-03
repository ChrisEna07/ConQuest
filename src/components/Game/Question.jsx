// src/components/Game/Question.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const Question = ({ question, selectedAnswer, onAnswer, theme }) => {
  const { boosts, deactivateBoost } = useGame();
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  
  const timerRef = useRef(null);
  const hasAnsweredRef = useRef(false);

  // Resetear el timer cuando cambia la pregunta
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    hasAnsweredRef.current = false;
    setTimeOut(false);
    setHiddenOptions([]);
    setShowHint(false);
    
    const initialTime = boosts.timeFreeze.active ? 40 : 30;
    setTimeLeft(initialTime);
    setTimerActive(true);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          setTimeOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [question.id, boosts.timeFreeze.active]);

  // Efecto para manejar el tiempo agotado
  useEffect(() => {
    if (timeOut && !selectedAnswer && !hasAnsweredRef.current) {
      hasAnsweredRef.current = true;
      setTimeout(() => {
        onAnswer(null);
      }, 500);
    }
  }, [timeOut, selectedAnswer, onAnswer]);

  // Efecto para el boost 50/50
  useEffect(() => {
    let fiftyFiftyTimer;
    if (boosts.fiftyFifty.active && !selectedAnswer && !timeOut) {
      const incorrectIndices = question.options
        .map((_, index) => index)
        .filter(index => index !== question.correct);
      
      const shuffled = [...incorrectIndices].sort(() => 0.5 - Math.random());
      const toHide = shuffled.slice(0, 2);
      setHiddenOptions(toHide);

      fiftyFiftyTimer = setTimeout(() => {
        setHiddenOptions([]);
        deactivateBoost('fiftyFifty');
      }, 5000);

      return () => {
        clearTimeout(fiftyFiftyTimer);
        deactivateBoost('fiftyFifty');
      };
    }
  }, [boosts.fiftyFifty.active, question, selectedAnswer, timeOut, deactivateBoost]);

  // Efecto para el boost timeFreeze
  useEffect(() => {
    return () => {
      if (boosts.timeFreeze.active) {
        deactivateBoost('timeFreeze');
      }
    };
  }, [boosts.timeFreeze.active, deactivateBoost]);

  // Efecto para el boost doublePoints
  useEffect(() => {
    if (selectedAnswer !== null && boosts.doublePoints.active) {
      deactivateBoost('doublePoints');
    }
  }, [selectedAnswer, boosts.doublePoints.active, deactivateBoost]);

  // Mostrar pista después de 10 segundos
  useEffect(() => {
    if (timeLeft === 20 && !selectedAnswer && !showHint && !timeOut) {
      setShowHint(true);
    }
  }, [timeLeft, selectedAnswer, showHint, timeOut]);

  // Efecto de confeti
  useEffect(() => {
    if (selectedAnswer !== null && selectedAnswer === question.correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [selectedAnswer, question.correct]);

  const handleOptionClick = (index) => {
    if (selectedAnswer !== null || timeOut || hasAnsweredRef.current) return;
    
    hasAnsweredRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onAnswer(index);
  };

  if (!question) return null;

  // Calcular porcentaje para el círculo de progreso
  const totalTime = boosts.timeFreeze.active ? 40 : 30;
  const percentage = (timeLeft / totalTime) * 100;
  
  // Determinar color según tiempo restante
  const getTimerColor = () => {
    if (percentage > 60) return '#10b981'; // Verde
    if (percentage > 30) return '#f59e0b'; // Amarillo
    return '#ef4444'; // Rojo
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full h-full flex flex-col relative"
    >
      {/* Confetti virtual */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: Math.random() * 200 - 100 + '%',
                  y: Math.random() * 200 - 100 + '%',
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header con timer y categoría - RESPONSIVO MEJORADO */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        {/* Timer circular - RESPONSIVO */}
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <div className="relative flex-shrink-0">
            {/* Círculo de progreso SVG */}
            <svg className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
                fill="none"
                className="sm:cx-40 sm:cy-40 sm:r-36"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke={getTimerColor()}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={175.9}
                initial={{ strokeDashoffset: 0 }}
                animate={{ 
                  strokeDashoffset: 175.9 * (1 - timeLeft / totalTime)
                }}
                transition={{ duration: 1, ease: "linear" }}
                className="sm:cx-40 sm:cy-40 sm:r-36"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className={`text-lg sm:text-xl md:text-2xl font-bold ${
                  timeLeft <= 10 ? 'text-red-400' : 'text-white'
                }`}
                animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {timeLeft}
              </motion.span>
            </div>
          </div>
          
          {/* Texto del timer para móvil */}
          <div className="sm:hidden text-white/60 text-sm">
            {timeLeft <= 10 ? '¡Corre!' : 'segundos'}
          </div>
        </div>

        {/* Categoría y dificultad - RESPONSIVO */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-white/20"
          >
            <span className="text-white text-xs sm:text-sm md:text-base whitespace-nowrap">
              {question.category}
            </span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 ${
              question.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' : 
              question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 
              'bg-red-500/20 text-red-300'
            }`}
          >
            <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
              {question.difficulty === 'easy' ? '★ Fácil' : 
               question.difficulty === 'medium' ? '★★ Medio' : '★★★ Difícil'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Indicadores de boosts */}
      <AnimatePresence>
        {boosts.doublePoints.active && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="text-center mb-3 sm:mb-4"
          >
            <div className="inline-block bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full border border-yellow-400/30">
              <span className="text-yellow-300 font-bold text-xs sm:text-sm md:text-base">
                ⚡ ¡PUNTOS DOBLES ACTIVOS! ⚡
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pregunta - TAMAÑO RESPONSIVO */}
      <motion.h2 
        className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center px-2 leading-relaxed"
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {question.question}
      </motion.h2>

      {/* Pista */}
      <AnimatePresence>
        {showHint && !selectedAnswer && !timeOut && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="text-center mb-3 sm:mb-4"
          >
            <div className="inline-block bg-blue-500/20 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full border border-blue-400/30">
              <span className="text-blue-300 text-xs sm:text-sm md:text-base">
                💡 Pista: La respuesta tiene {question.options[question.correct].length} letras
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opciones - GRID RESPONSIVO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 flex-1">
        {question.options.map((option, index) => {
          if (hiddenOptions.includes(index)) {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white/5 backdrop-blur-sm text-white/30 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl text-center border-2 border-dashed border-white/20 flex items-center justify-center"
              >
                <span className="text-xl sm:text-2xl mr-1 sm:mr-2">❓</span>
                <span className="text-xs sm:text-sm">Eliminada</span>
              </motion.div>
            );
          }

          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correct;
          
          const bgColor = isSelected 
            ? isCorrect 
              ? 'bg-gradient-to-br from-green-500/50 to-emerald-500/50'
              : 'bg-gradient-to-br from-red-500/50 to-rose-500/50'
            : 'bg-white/10 hover:bg-white/20';

          return (
            <motion.button
              key={index}
              whileHover={{ scale: (selectedAnswer === null && !timeOut) ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(index)}
              disabled={selectedAnswer !== null || timeOut}
              className={`${bgColor} text-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl text-left transition-all duration-300 border-2 ${
                isSelected 
                  ? isCorrect 
                    ? 'border-green-400 shadow-lg shadow-green-500/30'
                    : 'border-red-400 shadow-lg shadow-red-500/30'
                  : 'border-white/10 hover:border-white/30'
              } ${(selectedAnswer !== null || timeOut) ? 'opacity-50 cursor-not-allowed' : ''} backdrop-blur-sm relative overflow-hidden group`}
            >
              {/* Efecto de brillo */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Letra de la opción - TEXTO RESPONSIVO */}
              <div className="relative z-10 flex items-start">
                <span className={`font-bold text-base sm:text-lg md:text-xl lg:text-2xl mr-2 sm:mr-3 ${
                  isSelected ? 'text-white' : 'text-white/60'
                }`}>
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="break-words text-xs sm:text-sm md:text-base lg:text-lg flex-1">
                  {option}
                </span>
              </div>

              {/* Icono de selección */}
              {isSelected && (
                <motion.div
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 text-lg sm:text-2xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isCorrect ? '✅' : '❌'}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mensaje de tiempo agotado */}
      <AnimatePresence>
        {timeOut && !selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 sm:mt-6 text-center"
          >
            <div className="inline-block bg-red-500/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl border border-red-400/30">
              <span className="text-red-300 font-bold text-base sm:text-lg md:text-xl">
                ⏰ ¡Tiempo agotado!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultado */}
      <AnimatePresence>
        {selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mt-4 sm:mt-6 text-center"
          >
            {selectedAnswer === question.correct ? (
              <motion.div
                className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl inline-block border border-green-400/30"
                animate={{ 
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    '0 0 20px rgba(34,197,94,0.3)',
                    '0 0 40px rgba(34,197,94,0.5)',
                    '0 0 20px rgba(34,197,94,0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl">🎉</span>
                  <div className="text-left">
                    <p className="text-green-300 font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                      ¡Correcto!
                    </p>
                    <p className="text-white text-xs sm:text-sm md:text-base mt-1">
                      +{boosts.doublePoints.active ? question.reward * 2 : question.reward} monedas
                      {boosts.doublePoints.active && (
                        <span className="block text-xs text-yellow-300">(x2 por boost)</span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gradient-to-r from-red-500/30 to-rose-500/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl inline-block border border-red-400/30">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl">😢</span>
                  <div className="text-left">
                    <p className="text-red-300 font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                      Incorrecto
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">
                      Era: {question.options[question.correct]}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Question;