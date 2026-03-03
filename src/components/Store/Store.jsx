// src/components/Store/Store.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const Store = ({ onClose }) => {
  const { coins, buyBoost, buyTheme, buyAvatar, boosts } = useGame();

  const boostItems = [
    { id: 'doublePoints', name: 'Puntos Dobles', cost: 50, icon: '2️⃣', description: 'Gana el doble de monedas' },
    { id: 'skipQuestion', name: 'Saltar Pregunta', cost: 30, icon: '⏭️', description: 'Salta una pregunta difícil' },
    { id: 'timeFreeze', name: 'Congelar Tiempo', cost: 40, icon: '❄️', description: '10 segundos extra' },
    { id: 'fiftyFifty', name: '50/50', cost: 25, icon: '🎯', description: 'Elimina 2 opciones incorrectas' }
  ];

  const themeItems = [
    { key: 'default', name: 'Tema Original', cost: 0, icon: '🎨', owned: true },
    { key: 'dark', name: 'Modo Oscuro', cost: 100, icon: '🌙' },
    { key: 'nature', name: 'Naturaleza', cost: 150, icon: '🌿' },
    { key: 'ocean', name: 'Oceánico', cost: 150, icon: '🌊' },
    { key: 'sunset', name: 'Atardecer', cost: 200, icon: '🌅' }
  ];

  const avatarItems = [
    { key: 'default', name: 'Avatar Default', cost: 0, icon: '😊', owned: true },
    { key: 'ninja', name: 'Ninja', cost: 100, icon: '🥷' },
    { key: 'wizard', name: 'Mago', cost: 150, icon: '🧙' },
    { key: 'warrior', name: 'Guerrero', cost: 150, icon: '⚔️' },
    { key: 'alien', name: 'Alienígena', cost: 200, icon: '👽' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">🏪 Tienda</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-lg">
            <span className="text-2xl">🪙</span>
            <span className="text-white font-bold">{coins}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-white hover:text-red-300 text-2xl"
          >
            ✕
          </motion.button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Boosts */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">🚀 Boosts</h3>
          <div className="space-y-3">
            {boostItems.map(boost => (
              <motion.div
                key={boost.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/30 transition-colors relative overflow-hidden"
                onClick={() => buyBoost(boost.id, boost.cost)}
              >
                {boosts[boost.id]?.active && (
                  <motion.div
                    className="absolute inset-0 bg-green-500/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{boost.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{boost.name}</h4>
                      <p className="text-sm text-white/70">{boost.description}</p>
                      <p className="text-xs text-yellow-300 mt-1">
                        Cantidad: {boosts[boost.id]?.quantity || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300 font-bold">{boost.cost}</span>
                    <span className="text-yellow-300">🪙</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">🎨 Temas</h3>
          <div className="space-y-3">
            {themeItems.map(theme => (
              <motion.div
                key={theme.key}
                whileHover={{ scale: 1.02 }}
                className="bg-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => !theme.owned && buyTheme(theme.key, theme.cost)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{theme.icon}</span>
                    <h4 className="font-semibold text-white">{theme.name}</h4>
                  </div>
                  {theme.owned ? (
                    <span className="text-green-300">✓ Adquirido</span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-300 font-bold">{theme.cost}</span>
                      <span className="text-yellow-300">🪙</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Avatars */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4">👤 Avatares</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {avatarItems.map(avatar => (
              <motion.div
                key={avatar.key}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/30 transition-colors text-center"
                onClick={() => !avatar.owned && buyAvatar(avatar.key, avatar.cost)}
              >
                <div className="text-4xl mb-2">{avatar.icon}</div>
                <h4 className="font-semibold text-white text-sm">{avatar.name}</h4>
                {avatar.owned ? (
                  <span className="text-green-300 text-xs">✓ Adquirido</span>
                ) : (
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <span className="text-yellow-300 font-bold text-sm">{avatar.cost}</span>
                    <span className="text-yellow-300 text-xs">🪙</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Store; // ← Asegúrate de que esta línea existe