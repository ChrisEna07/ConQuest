import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerSelector = ({ onSelect, onBack }) => {
  const [step, setStep] = useState(1);
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(['']);

  const handlePlayerCount = (count) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(''));
    setStep(2);
  };

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleSubmit = () => {
    const validNames = playerNames.map(name => name.trim());
    if (validNames.some(name => name.length < 3)) {
      alert('Todos los nombres deben tener al menos 3 caracteres');
      return;
    }
    onSelect(validNames);
  };

  const playerIcons = ['👤', '👥', '👨‍👩‍👧', '👨‍👩‍👧‍👦'];

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 overflow-y-auto">
      {/* Fondo con ondas */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 25
          }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
            {/* Botón volver */}
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="text-white/60 hover:text-white mb-6 text-sm flex items-center gap-2 transition-colors group"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              <span>Volver al inicio</span>
            </motion.button>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 30, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                    ¿Cuántos jugadores?
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(num => (
                      <motion.button
                        key={num}
                        whileHover={{ 
                          scale: 1.05,
                          rotate: [0, -1, 1, -1, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayerCount(num)}
                        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white p-6 rounded-2xl text-center border-2 border-white/10 hover:border-white/30 transition-all"
                      >
                        <div className="text-4xl mb-2">{playerIcons[num - 1]}</div>
                        <div className="text-2xl font-bold">{num}</div>
                        <div className="text-sm text-white/60 mt-1">
                          {num === 1 ? 'Jugador' : 'Jugadores'}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
                    <span className="text-3xl mr-2">{playerIcons[playerCount - 1]}</span>
                    <br />
                    Nombres de los {playerCount} {playerCount === 1 ? 'jugador' : 'jugadores'}
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {playerNames.map((name, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <label className="text-white/80 text-sm mb-2 block">
                          Jugador {index + 1}
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 text-xl">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            placeholder={`Nombre del jugador ${index + 1}`}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 text-base transition-all"
                            autoFocus={index === 0}
                            maxLength={15}
                          />
                        </div>
                        {name.length > 0 && name.length < 3 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-300 text-xs mt-2"
                          >
                            Mínimo 3 caracteres
                          </motion.p>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStep(1)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-semibold transition-all text-base border border-white/10"
                    >
                      Atrás
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-base shadow-lg"
                    >
                      ¡Comenzar!
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicador de progreso */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2].map(i => (
                <motion.div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === i ? 'w-8 bg-white' : 'w-4 bg-white/30'
                  }`}
                  animate={step === i ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerSelector;