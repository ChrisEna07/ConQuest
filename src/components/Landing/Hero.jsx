// src/components/Landing/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -30, 30, -30],
              x: [null, 30, -30, 30],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Conquest
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
              Question
            </span>
          </motion.h1>
          
          <p className="text-xl sm:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Demuestra tus conocimientos, gana monedas, personaliza tu avatar 
            y compite con amigos en el juego de preguntas más emocionante.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl text-lg shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">Comenzar Ahora</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-bold rounded-xl text-lg border-2 border-white/20 hover:border-white/40 transition-all"
            >
              Ver Demo
            </motion.button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { number: '500+', label: 'Preguntas' },
              { number: '10k+', label: 'Jugadores' },
              { number: '50+', label: 'Avatares' },
              { number: '24/7', label: 'Soporte' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-4"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;