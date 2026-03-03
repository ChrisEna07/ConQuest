// src/components/Game/Question.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const Question = ({ question, selectedAnswer, onAnswer, theme, questionNumber, totalQuestions }) => {
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
    // Limpiar timer anterior
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Resetear estados internos
    hasAnsweredRef.current = false;
    setTimeOut(false);
    setHiddenOptions([]);
    setShowHint(false);
    
    // Configurar nuevo tiempo
    const initialTime = boosts.timeFreeze.active ? 40 : 30;
    setTimeLeft(initialTime);
    setTimerActive(true);
    
    // Iniciar nuevo timer
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

  // Efecto para el boost 50/50 - se desactiva automáticamente después de 5 segundos
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

  // Efecto para el boost timeFreeze - se desactiva al terminar la pregunta
  useEffect(() => {
    return () => {
      if (boosts.timeFreeze.active) {
        deactivateBoost('timeFreeze');
      }
    };
  }, [boosts.timeFreeze.active, deactivateBoost]);

  // Efecto para el boost doublePoints - se desactiva al responder
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

  // Efecto de confeti para respuestas correctas
  useEffect(() => {
    if (selectedAnswer !== null && selectedAnswer === question.correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [selectedAnswer, question.correct]);

  // Manejar clic en opción
  const handleOptionClick = (index) => {
    if (selectedAnswer !== null || timeOut || hasAnsweredRef.current) return;
    
    hasAnsweredRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onAnswer(index);
  };

  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full h-full flex flex-col relative"
    >
      {/* Confeti virtual */}
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
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
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

      {/* Header con timer, contador de preguntas y categoría */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Timer circular */}
        <div className="relative">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke={timeLeft <= 10 ? "#ef4444" : "#f59e0b"}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={226.2}
              initial={{ strokeDashoffset: 0 }}
              animate={{ 
                strokeDashoffset: 226.2 * (1 - timeLeft / (boosts.timeFreeze.active ? 40 : 30))
              }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className={`text-xl sm:text-2xl font-bold ${
                timeLeft <= 10 ? 'text-red-400' : 'text-white'
              }`}
              animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {timeLeft}
            </motion.span>
          </div>
        </div>

        {/* Contador de preguntas */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
        >
          <span className="text-white font-bold text-lg sm:text-xl">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
        </motion.div>

        {/* Categoría y dificultad */}
        <div className="flex flex-wrap justify-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
          >
            <span className="text-white text-sm sm:text-base">{question.category}</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 ${
              question.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' : 
              question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 
              'bg-red-500/20 text-red-300'
            }`}
          >
            <span className="text-sm sm:text-base font-medium">
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
            className="text-center mb-4"
          >
            <div className="inline-block bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm px-6 py-3 rounded-full border border-yellow-400/30">
              <span className="text-yellow-300 font-bold text-sm sm:text-base">
                ⚡ ¡PUNTOS DOBLES ACTIVOS! ⚡
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pregunta */}
      <motion.h2 
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 text-center px-2 leading-relaxed"
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
            className="text-center mb-4"
          >
            <div className="inline-block bg-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-400/30">
              <span className="text-blue-300 text-sm sm:text-base">
                💡 Pista: La respuesta tiene {question.options[question.correct].length} letras
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
        {question.options.map((option, index) => {
          if (hiddenOptions.includes(index)) {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white/5 backdrop-blur-sm text-white/30 p-4 sm:p-6 rounded-xl text-center border-2 border-dashed border-white/20 flex items-center justify-center"
              >
                <span className="text-2xl mr-2">❓</span>
                <span className="text-sm">Eliminada</span>
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
              whileHover={{ scale: (selectedAnswer === null && !timeOut) ? 1.03 : 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(index)}
              disabled={selectedAnswer !== null || timeOut}
              className={`${bgColor} text-white p-4 sm:p-6 rounded-xl text-left transition-all duration-300 border-2 ${
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
              
              {/* Letra de la opción */}
              <div className="relative z-10 flex items-start">
                <span className={`font-bold text-xl sm:text-2xl mr-3 ${
                  isSelected ? 'text-white' : 'text-white/60'
                }`}>
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="break-words text-sm sm:text-base md:text-lg flex-1">
                  {option}
                </span>
              </div>

              {/* Icono de selección */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 text-2xl"
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
            className="mt-6 text-center"
          >
            <div className="inline-block bg-red-500/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-red-400/30">
              <span className="text-red-300 font-bold text-lg sm:text-xl">
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
            className="mt-6 text-center"
          >
            {selectedAnswer === question.correct ? (
              <motion.div
                className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-sm px-8 py-4 rounded-2xl inline-block border border-green-400/30"
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
                <span className="text-4xl mr-3">🎉</span>
                <div className="inline-block text-left">
                  <p className="text-green-300 font-bold text-xl sm:text-2xl">
                    ¡Correcto!
                  </p>
                  <p className="text-white text-base sm:text-lg mt-1">
                    +{boosts.doublePoints.active ? question.reward * 2 : question.reward} monedas
                    {boosts.doublePoints.active && (
                      <span className="block text-sm text-yellow-300">(x2 por boost)</span>
                    )}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gradient-to-r from-red-500/30 to-rose-500/30 backdrop-blur-sm px-8 py-4 rounded-2xl inline-block border border-red-400/30">
                <span className="text-4xl mr-3">😢</span>
                <div className="inline-block text-left">
                  <p className="text-red-300 font-bold text-xl sm:text-2xl">
                    Incorrecto
                  </p>
                  <p className="text-white/80 text-sm sm:text-base mt-1">
                    Respuesta correcta: {question.options[question.correct]}
                  </p>
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