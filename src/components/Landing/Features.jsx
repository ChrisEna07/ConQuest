// src/components/Landing/Features.jsx
import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎮',
    title: 'Múltiples Categorías',
    description: 'Preguntas de historia, ciencia, arte, geografía y más.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: '🪙',
    title: 'Gana Monedas',
    description: 'Responde correctamente y acumula monedas para gastar en la tienda.',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    icon: '🚀',
    title: 'Boosts Especiales',
    description: 'Usa comodines para ayudarte en preguntas difíciles.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: '🎨',
    title: 'Personalización',
    description: 'Cambia tu avatar, tema y personaliza tu experiencia.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: '🏆',
    title: 'Niveles y Logros',
    description: 'Sube de nivel y desbloquea logros exclusivos.',
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: '👥',
    title: 'Multijugador',
    description: 'Compite con amigos y sube en el ranking global.',
    color: 'from-indigo-500 to-purple-500'
  }
];

const Features = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Por qué elegir ConquestQuestion?
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            La experiencia de juego más completa y divertida para poner a prueba tus conocimientos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 h-full">
                <div className={`text-5xl mb-4 bg-gradient-to-r ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;