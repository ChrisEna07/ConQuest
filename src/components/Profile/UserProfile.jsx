// src/components/Profile/UserProfile.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const UserProfile = ({ onClose }) => {
  const { 
    userName, setUserName, avatar, coins, level, experience, 
    currentTheme, currentTitle, correctStreak, maxStreak, 
    unlockedTitles, titles, streakTitles 
  } = useGame();
  
  const [newName, setNewName] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);
  const [showTitles, setShowTitles] = useState(false);

  const handleSaveName = () => {
    setUserName(newName);
    setIsEditing(false);
  };

  const getAvatarEmoji = () => {
    const avatars = {
      default: '😊',
      ninja: '🥷',
      wizard: '🧙',
      warrior: '⚔️',
      alien: '👽'
    };
    return avatars[avatar] || '😊';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Perfil</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="text-white hover:text-red-300 text-xl sm:text-2xl"
        >
          ✕
        </motion.button>
      </div>

      {/* Avatar y nombre */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4"
        >
          {getAvatarEmoji()}
        </motion.div>

        {isEditing ? (
          <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white text-sm sm:text-base"
              maxLength={20}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveName}
              className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm sm:text-base whitespace-nowrap"
            >
              Guardar
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(true)}
            className="text-xl sm:text-2xl font-bold text-white hover:text-yellow-300 transition-colors"
          >
            {userName} ✏️
          </motion.button>
        )}
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white/20 rounded-lg p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl mb-1">🪙</div>
          <div className="text-white font-bold text-sm sm:text-base">{coins}</div>
          <div className="text-white/60 text-xs">Monedas</div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl mb-1">📊</div>
          <div className="text-white font-bold text-sm sm:text-base">Nivel {level}</div>
          <div className="text-white/60 text-xs">{experience}/100 XP</div>
        </div>

        <div className="bg-white/20 rounded-lg p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl mb-1">🔥</div>
          <div className="text-white font-bold text-sm sm:text-base">{correctStreak}</div>
          <div className="text-white/60 text-xs">Racha actual</div>
        </div>

        <div className="bg-white/20 rounded-lg p-2 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl mb-1">🏆</div>
          <div className="text-white font-bold text-sm sm:text-base">{maxStreak}</div>
          <div className="text-white/60 text-xs">Mejor racha</div>
        </div>
      </div>

      {/* Título actual */}
      <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg p-3 sm:p-4 mb-4">
        <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Título actual</h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl">{titles[currentTitle]?.icon || '🌱'}</span>
          <div>
            <p className="text-white font-bold text-base sm:text-lg">{currentTitle}</p>
            <p className="text-white/60 text-xs sm:text-sm">{titles[currentTitle]?.description}</p>
          </div>
        </div>
      </div>

      {/* Botón para ver todos los títulos */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowTitles(!showTitles)}
        className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg mb-4 transition-colors text-sm sm:text-base"
      >
        {showTitles ? 'Ocultar títulos' : 'Ver todos los títulos'}
      </motion.button>

      {/* Lista de títulos */}
      {showTitles && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 mb-4"
        >
          <h3 className="text-white font-semibold text-sm sm:text-base">Títulos por experiencia</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(titles).map(([title, data]) => (
              <div
                key={title}
                className={`p-2 rounded-lg ${
                  unlockedTitles.includes(title)
                    ? `bg-gradient-to-r ${data.color} bg-opacity-30`
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{data.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${
                      unlockedTitles.includes(title) ? 'text-white' : 'text-white/40'
                    }`}>
                      {title}
                    </p>
                    <p className="text-xs text-white/40">{data.description}</p>
                  </div>
                  {!unlockedTitles.includes(title) && (
                    <span className="text-xs text-white/30">🔒 {data.requirement} respuestas</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-white font-semibold text-sm sm:text-base mt-4">Títulos por racha</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(streakTitles).map(([streak, data]) => (
              <div
                key={streak}
                className={`p-2 rounded-lg ${
                  maxStreak >= parseInt(streak)
                    ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30'
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{data.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${
                      maxStreak >= parseInt(streak) ? 'text-white' : 'text-white/40'
                    }`}>
                      {data.name}
                    </p>
                    <p className="text-xs text-white/40">{data.description}</p>
                  </div>
                  {maxStreak < parseInt(streak) && (
                    <span className="text-xs text-white/30">🔒 {streak} racha</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Estadísticas adicionales */}
      <div className="bg-white/20 rounded-lg p-3 sm:p-4">
        <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Estadísticas</h3>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-white/80">
            <span>Partidas jugadas:</span>
            <span className="font-bold">24</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Respuestas correctas:</span>
            <span className="font-bold">187</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Precisión:</span>
            <span className="font-bold">78%</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Tema actual:</span>
            <span className="font-bold capitalize">{currentTheme}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Títulos desbloqueados:</span>
            <span className="font-bold">{unlockedTitles.length}/{Object.keys(titles).length}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;