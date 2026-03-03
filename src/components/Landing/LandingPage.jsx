import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const LandingPage = ({ onStart }) => {
  const { playSound, soundEnabled } = useGame();

  const handleStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('✅ Botón clickeado - LandingPage');
    
    if (playSound) {
      try {
        playSound('click');
      } catch (error) {
        console.log('Error reproduciendo sonido:', error);
      }
    }
    
    if (onStart) {
      console.log('📢 Llamando a onStart');
      onStart();
    } else {
      console.error('❌ onStart no está definido');
    }
  };

  // Verificar que las props existen
  useEffect(() => {
    console.log('📦 LandingPage montada');
    console.log('🎮 onStart disponible:', !!onStart);
    console.log('🔊 playSound disponible:', !!playSound);
  }, [onStart, playSound]);

  // Partículas animadas
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 overflow-y-auto" style={{ zIndex: 10 }}>
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white/20 rounded-full pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0, 30, 0],
              x: [0, 30, 0, -30, 0],
              opacity: [0.2, 0.5, 0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative min-h-screen w-full flex items-center justify-center p-4" style={{ zIndex: 20, position: 'relative' }}>
        <div className="max-w-5xl w-full">
          <div className="text-center">
            {/* Logo/Título */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4">
                <span className="text-white">Conquest</span>
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-transparent bg-clip-text">
                  Question
                </span>
              </h1>
            </motion.div>

            {/* Descripción */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto px-4"
            >
              Demuestra tus conocimientos, gana monedas, personaliza tu avatar 
              y compite con amigos en el juego de preguntas más emocionante.
            </motion.p>

            {/* Botón principal - Sin motion.div envolvente */}
            <div className="mb-16" style={{ position: 'relative', zIndex: 30 }}>
              <button
                onClick={handleStart}
                className="px-10 py-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-bold rounded-2xl text-xl sm:text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 30,
                  pointerEvents: 'auto',
                  border: 'none',
                  outline: 'none'
                }}
              >
                <span className="flex items-center gap-2">
                  ✨ Comenzar Aventura ✨
                </span>
              </button>
            </div>

            {/* Grid de características */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4" style={{ position: 'relative', zIndex: 25 }}>
              {[
                { icon: '🎮', text: '100+ Preguntas', color: 'from-blue-500 to-cyan-500' },
                { icon: '🪙', text: 'Gana Monedas', color: 'from-yellow-500 to-amber-500' },
                { icon: '🚀', text: 'Boosts Especiales', color: 'from-purple-500 to-pink-500' },
                { icon: '👥', text: 'Multijugador', color: 'from-green-500 to-emerald-500' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className={`bg-gradient-to-br ${feature.color} p-1 rounded-2xl`}
                >
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 h-full">
                    <div className="text-3xl sm:text-4xl mb-2">{feature.icon}</div>
                    <div className="text-white text-xs sm:text-sm font-medium">{feature.text}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ondas decorativas - Ahora con pointer-events-none y z-index bajo */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 5 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-20">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default LandingPage;