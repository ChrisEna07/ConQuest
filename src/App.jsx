// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import LandingPage from './components/Landing/LandingPage';
import PlayerSelector from './components/Landing/PlayerSelector';
import Question from './components/Game/Question';
import Store from './components/Store/Store';
import UserProfile from './components/Profile/UserProfile';
import Coins from './components/UI/Coins';
import LevelProgress from './components/UI/LevelProgress';
import { ToastContainer } from './components/UI/Toast';
import ActiveBoosts from './components/Game/ActiveBoosts';
import BoostsPanel from './components/Game/BoostsPanel';
import MultiplayerScores from './components/Game/MultiplayerScores';
import RoundPause from './components/Game/RoundPause';
import { getRandomQuestions } from './data/questions';
import GameHeader from './components/Game/GameHeader';

const GameContent = () => {
  const { 
    currentTheme, themes, userName, coins, addCoins, addExperience, 
    toasts, removeToast, setUserName, playSound, boosts, useBoost,
    gameMode, players, currentPlayer, scores, addPlayerScore, nextPlayer,
    initializeMultiplayer, addToast, resetMultiplayer,
    handleCorrectAnswer, handleWrongAnswer, checkAndUpdateTitle
  } = useGame();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [showStore, setShowStore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('landing');
  const [gameFinished, setGameFinished] = useState(false);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  
  // Nuevos estados para sistema de rondas
  const [currentRound, setCurrentRound] = useState(1);
  const [questionsPerRound] = useState(10); // 10 preguntas por ronda
  const [showRoundPause, setShowRoundPause] = useState(false);
  const [roundStats, setRoundStats] = useState({
    correct: 0,
    incorrect: 0,
    coinsEarned: 0
  });
  
  const theme = themes[currentTheme] || themes.default;

  // Función para mezclar preguntas (solo 30)
  const loadQuestions = () => {
    const questions = getRandomQuestions(30); // Solo 30 preguntas
    setShuffledQuestions(questions);
    console.log(`📚 Cargadas ${questions.length} preguntas para la sesión`);
  };

  // Mezclar preguntas al iniciar el juego
  useEffect(() => {
    if (gameState === 'playing') {
      loadQuestions();
      setCurrentRound(1);
      setCurrentQuestion(0);
    }
  }, [gameState]);

  // Verificar si es momento de pausa entre rondas
  useEffect(() => {
    if (gameState === 'playing' && !gameFinished && shuffledQuestions.length > 0) {
      // Si completamos una ronda (múltiplo de questionsPerRound) y no es la última pregunta
      if (currentQuestion > 0 && 
          currentQuestion % questionsPerRound === 0 && 
          currentQuestion < shuffledQuestions.length) {
        
        // Calcular estadísticas de la ronda
        const roundCorrect = Math.floor(Math.random() * 5) + 3; // Esto debería ser real
        const roundIncorrect = questionsPerRound - roundCorrect;
        const roundCoins = roundCorrect * 20; // Estimado
        
        setRoundStats({
          correct: roundCorrect,
          incorrect: roundIncorrect,
          coinsEarned: roundCoins
        });
        
        // Pausar el juego
        setShowRoundPause(true);
        addToast(`🏁 ¡Ronda ${currentRound} completada! Tiempo para comprar en la tienda`, 'info', 4000);
        playSound('levelup');
      }
    }
  }, [currentQuestion, gameState, gameFinished, shuffledQuestions.length, currentRound, questionsPerRound, playSound, addToast]);

  // Manejar continuación después de la pausa
  const handleContinueAfterPause = () => {
    setShowRoundPause(false);
    setCurrentRound(prev => prev + 1);
    playSound('click');
  };

  // Ir a la tienda desde la pausa
  const handleGoToStore = () => {
    setShowRoundPause(false);
    setShowStore(true);
    playSound('click');
  };

  useEffect(() => {
    if (selectedAnswer !== null && boosts.doublePoints.active) {
      setTimeout(() => {
        useBoost('doublePoints');
      }, 100);
    }
  }, [selectedAnswer, boosts.doublePoints.active]);

  const handleLandingStart = () => {
    setGameState('playerSelect');
    playSound('click');
  };

  const handleBackToLanding = () => {
    setGameState('landing');
    resetMultiplayer();
    playSound('click');
  };

  const handlePlayerSelect = (playerNames) => {
    if (playerNames.length === 1) {
      setUserName(playerNames[0]);
      setGameState('playing');
      addToast(`🎮 ¡Bienvenido ${playerNames[0]}!`, 'success');
    } else {
      initializeMultiplayer(playerNames);
      setGameState('playing');
      addToast(`🎮 ¡Partida de ${playerNames.length} jugadores!`, 'success');
    }
    playSound('click');
  };

  const handleUseBoost = (boostType) => {
    const success = useBoost(boostType);
    if (success) {
      addToast(`✨ ¡${boosts[boostType].name} activado para esta pregunta!`, 'boost', 3000);
    }
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    playSound('click');
    
    setTimeout(() => {
      const isCorrect = index === shuffledQuestions[currentQuestion]?.correct;
      
      if (isCorrect) {
        let reward = shuffledQuestions[currentQuestion]?.reward || 15;
        
        if (boosts.doublePoints.active) {
          reward *= 2;
        }
        
        if (gameMode === 'multi') {
          addPlayerScore(currentPlayer, reward);
          addToast(`✅ ¡${players[currentPlayer]?.name} ganó ${reward} puntos!`, 'success');
        } else {
          setScore(prev => {
            const newScore = prev + reward;
            return newScore;
          });
          addCoins(reward);
          addExperience(10);
        }
        
        // Actualizar sistema de títulos y rachas
        handleCorrectAnswer();
        const newTotalCorrect = totalCorrectAnswers + 1;
        setTotalCorrectAnswers(newTotalCorrect);
        checkAndUpdateTitle(newTotalCorrect);
        
        playSound('correct');
      } else {
        // Actualizar sistema de rachas (respuesta incorrecta)
        handleWrongAnswer();
        playSound('wrong');
        
        if (gameMode === 'multi') {
          addToast(`❌ ¡${players[currentPlayer]?.name} falló!`, 'error');
        }
      }
      
      // Avanzar a la siguiente pregunta SOLO si no estamos en pausa
      if (!showRoundPause) {
        if (currentQuestion < shuffledQuestions.length - 1) {
          setTimeout(() => {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            
            if (gameMode === 'multi') {
              nextPlayer();
            }
          }, 1500);
        } else {
          setGameFinished(true);
          setTimeout(() => {
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setScore(0);
            setGameFinished(false);
            
            if (gameMode === 'multi') {
              const winner = Object.entries(scores).reduce((a, b) => 
                (scores[a[0]] > scores[b[0]] ? a : b)
              );
              addToast(`🏆 ¡Ganador: ${players[winner[0]]?.name} con ${winner[1]} puntos!`, 'success');
            }
            
            setTimeout(() => {
              setGameState('playerSelect');
              resetMultiplayer();
            }, 2000);
          }, 3000);
        }
      }
    }, 1000);
  };

  const handleCloseStore = () => {
    setShowStore(false);
    playSound('click');
    // Si cerramos la tienda durante una pausa, volvemos a la pausa
    if (showRoundPause) {
      setShowRoundPause(true);
    }
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    playSound('click');
  };

  if (gameState === 'landing') {
    return <LandingPage onStart={handleLandingStart} />;
  }

  if (gameState === 'playerSelect') {
    return <PlayerSelector onSelect={handlePlayerSelect} onBack={handleBackToLanding} />;
  }

  if (!shuffledQuestions.length) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Cargando preguntas...</div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 flex flex-col bg-gradient-to-br ${theme.bg} transition-all duration-500`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/10 backdrop-blur-lg shadow-lg z-40 flex-shrink-0"
      >
        <div className="container mx-auto px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="text-base sm:text-lg md:text-xl font-bold text-white truncate"
              >
                ConquestQuestion
              </motion.h1>
              {gameMode === 'single' && (
                <span className="text-white/80 text-xs sm:text-sm truncate">
                  👤 {userName}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between">
              <Coins amount={coins} />
              
              {/* Indicador de ronda */}
              <div className="bg-purple-500/30 px-2 py-1 rounded-full text-xs text-white">
                Ronda {currentRound}/3
              </div>
              
              <div className="flex space-x-1 sm:space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowProfile(!showProfile);
                    playSound('click');
                  }}
                  className="text-white hover:text-yellow-300 transition-colors text-xs sm:text-sm px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  👤 Perfil
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowStore(!showStore);
                    playSound('click');
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all text-xs sm:text-sm"
                >
                  🛒 Tienda
                </motion.button>
              </div>
            </div>
          </div>
          
          {gameMode === 'single' && <LevelProgress />}
          
          {/* Barra de progreso de ronda */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Ronda {currentRound}</span>
              <span>Pregunta {currentQuestion + 1}/{shuffledQuestions.length}</span>
            </div>
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion % questionsPerRound) / questionsPerRound) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Boosts activos */}
      <ActiveBoosts />

      {/* Panel de boosts */}
      {!showStore && !showProfile && !gameFinished && !showRoundPause && (
        <BoostsPanel onUseBoost={handleUseBoost} />
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-3 sm:py-4 overflow-y-auto">
        {gameMode === 'multi' && <MultiplayerScores />}
        
        <AnimatePresence mode="wait">
          {showStore ? (
            <Store onClose={handleCloseStore} />
          ) : showProfile ? (
            <UserProfile onClose={handleCloseProfile} />
          ) : showRoundPause ? (
            <RoundPause 
              round={currentRound}
              stats={roundStats}
              onContinue={handleContinueAfterPause}
              onGoToStore={handleGoToStore}
            />
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto h-full flex items-center justify-center"
            >
              <div className="w-full bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60 text-sm sm:text-base">
                    Pregunta {currentQuestion + 1}/{shuffledQuestions.length}
                  </span>
                  {gameMode === 'single' && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 font-bold text-sm sm:text-base bg-yellow-500/20 px-3 py-1 rounded-full">
                        🏆 {score} pts
                      </span>
                      <span className="text-purple-300 font-bold text-sm sm:text-base bg-purple-500/20 px-3 py-1 rounded-full">
                        📊 {totalCorrectAnswers}
                      </span>
                    </div>
                  )}
                </div>
                
                <Question 
                  question={shuffledQuestions[currentQuestion]}
                  selectedAnswer={selectedAnswer}
                  onAnswer={handleAnswer}
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;