// src/components/Game/MultiplayerScores.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const MultiplayerScores = () => {
  const { players, scores, currentPlayer } = useGame();

  if (!players || players.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4">
      <h3 className="text-white font-bold mb-3 text-center">Puntuaciones</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            className={`p-3 rounded-lg text-center ${
              index === currentPlayer 
                ? 'bg-yellow-500/30 border-2 border-yellow-400' 
                : 'bg-white/10'
            }`}
            animate={index === currentPlayer ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="text-2xl mb-1">👤</div>
            <div className="text-white font-semibold text-sm truncate">
              {player.name}
            </div>
            <div className="text-yellow-300 font-bold">
              {scores[index] || 0} pts
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center text-white/80 text-sm mt-2">
        Turno de: <span className="text-yellow-300 font-bold">{players[currentPlayer]?.name}</span>
      </div>
    </div>
  );
};

export default MultiplayerScores;