// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import LandingPage from './components/Landing/LandingPage';
import PlayerSelector from './components/Landing/PlayerSelector';
import Question from './components/Game/Question';
import Store from './components/Store/Store';
import UserProfile from './components/Profile/UserProfile';
import { ToastContainer } from './components/UI/Toast';
import ActiveBoosts from './components/Game/ActiveBoosts';
import BoostsPanel from './components/Game/BoostsPanel';
import MultiplayerScores from './components/Game/MultiplayerScores';
import RoundPause from './components/Game/RoundPause';
import GameHeader from './components/Game/GameHeader';
import { getRandomQuestions } from './data/questions';

const GameContent = () => {
  const { 
    currentTheme, themes, userName, coins, addCoins, addExperience, 
    toasts, removeToast, setUserName, playSound, boosts, useBoost,
    gameMode, players, currentPlayer, scores, addPlayerScore, nextPlayer,
    initializeMultiplayer, addToast, resetMultiplayer,
    handleCorrectAnswer, handleWrongAnswer, checkAndUpdateTitle,
    currentTitle, correctStreak
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
  
  // Estados para sistema de rondas
  const [currentRound, setCurrentRound] = useState(1);
  const [questionsPerRound] = useState(10);
  const [showRoundPause, setShowRoundPause] = useState(false);
  const [roundStats, setRoundStats] = useState({
    correct: 0,
    incorrect: 0,
    coinsEarned: 0,
    roundScore: 0
  });
  const [pauseTriggered, setPauseTriggered] = useState(false);
  const [roundCorrectAnswers, setRoundCorrectAnswers] = useState(0);
  const [roundWrongAnswers, setRoundWrongAnswers] = useState(0);
  
  const theme = themes[currentTheme] || themes.default;

  // Función para mezclar preguntas
  const loadQuestions = useCallback(() => {
    const questions = getRandomQuestions(30);
    setShuffledQuestions(questions);
    console.log(`📚 Cargadas ${questions.length} preguntas`);
  }, []);

  // Mezclar preguntas al iniciar el juego
  useEffect(() => {
    if (gameState === 'playing') {
      loadQuestions();
      setCurrentRound(1);
      setCurrentQuestion(0);
      setTotalCorrectAnswers(0);
      setScore(0);
      setPauseTriggered(false);
      setShowRoundPause(false);
      setRoundCorrectAnswers(0);
      setRoundWrongAnswers(0);
    }
  }, [gameState, loadQuestions]);

  // Calcular estadísticas de la ronda
  const calculateRoundStats = useCallback(() => {
    setRoundStats({
      correct: roundCorrectAnswers,
      incorrect: roundWrongAnswers,
      coinsEarned: roundCorrectAnswers * 20,
      roundScore: roundCorrectAnswers * 100
    });
  }, [roundCorrectAnswers, roundWrongAnswers]);

  // Verificar si es momento de pausa entre rondas
  useEffect(() => {
    // Solo verificar si estamos jugando, no en pausa, no terminado, y hay preguntas
    if (gameState !== 'playing' || gameFinished || showRoundPause || shuffledQuestions.length === 0) {
      return;
    }

    // Verificar si hemos completado una ronda (10 preguntas) y no es la última pregunta
    const isRoundComplete = currentQuestion > 0 && 
                           currentQuestion % questionsPerRound === 0 && 
                           currentQuestion < shuffledQuestions.length;

    if (isRoundComplete && !pauseTriggered) {
      console.log(`🏁 Ronda ${currentRound} completada en pregunta ${currentQuestion}`);
      setPauseTriggered(true);
      calculateRoundStats();
      setShowRoundPause(true);
      addToast(`🏁 ¡Ronda ${currentRound} completada!`, 'info', 3000);
      playSound('levelup');
    }
  }, [currentQuestion, gameState, gameFinished, showRoundPause, shuffledQuestions.length, currentRound, questionsPerRound, pauseTriggered, calculateRoundStats, playSound, addToast]);

  // Manejar continuación después de la pausa
  const handleContinueAfterPause = useCallback(() => {
    console.log(`▶️ Continuando a la siguiente ronda desde ronda ${currentRound}`);
    setShowRoundPause(false);
    setPauseTriggered(false);
    setRoundCorrectAnswers(0);
    setRoundWrongAnswers(0);
    playSound('click');
    // Importante: NO incrementamos currentRound aquí, se incrementará naturalmente
    // cuando se respondan las preguntas de la siguiente ronda
  }, [playSound, currentRound]);

  // Ir a la tienda desde la pausa
  const handleGoToStore = useCallback(() => {
    setShowRoundPause(false);
    setShowStore(true);
    playSound('click');
  }, [playSound]);

  // Efecto para desactivar puntos dobles
  useEffect(() => {
    if (selectedAnswer !== null && boosts.doublePoints.active) {
      const timer = setTimeout(() => {
        useBoost('doublePoints');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, boosts.doublePoints.active, useBoost]);

  const handleLandingStart = useCallback(() => {
    setGameState('playerSelect');
    playSound('click');
  }, [playSound]);

  const handleBackToLanding = useCallback(() => {
    setGameState('landing');
    resetMultiplayer();
    playSound('click');
  }, [playSound, resetMultiplayer]);

  const handlePlayerSelect = useCallback((playerNames) => {
    if (playerNames.length === 1) {
      setUserName(playerNames[0]);
      setGameState('playing');
      addToast(`🎮 ¡Bienvenido ${playerNames[0]}!`, 'success', 3000);
    } else {
      initializeMultiplayer(playerNames);
      setGameState('playing');
      addToast(`🎮 ¡Partida de ${playerNames.length} jugadores!`, 'success', 3000);
    }
    playSound('click');
  }, [playSound, initializeMultiplayer, addToast, setUserName]);

  const handleUseBoost = useCallback((boostType) => {
    const success = useBoost(boostType);
    if (success) {
      addToast(`✨ ¡${boosts[boostType].name} activado!`, 'boost', 2000);
    }
  }, [useBoost, boosts, addToast]);

  const handleAnswer = useCallback((index) => {
    if (selectedAnswer !== null || showRoundPause) return;
    
    setSelectedAnswer(index);
    playSound('click');
    
    setTimeout(() => {
      const isCorrect = index === shuffledQuestions[currentQuestion]?.correct;
      const currentReward = shuffledQuestions[currentQuestion]?.reward || 15;
      let reward = currentReward;
      
      if (isCorrect) {
        if (boosts.doublePoints.active) {
          reward *= 2;
        }
        
        if (gameMode === 'multi') {
          addPlayerScore(currentPlayer, reward);
          addToast(`✅ ¡${players[currentPlayer]?.name} ganó ${reward} puntos!`, 'success', 2000);
        } else {
          setScore(prev => prev + reward);
          addCoins(reward);
          addExperience(10);
        }
        
        // Actualizar sistema de títulos y rachas
        handleCorrectAnswer();
        const newTotalCorrect = totalCorrectAnswers + 1;
        setTotalCorrectAnswers(newTotalCorrect);
        checkAndUpdateTitle(newTotalCorrect);
        
        // Actualizar contadores de la ronda
        setRoundCorrectAnswers(prev => prev + 1);
        
        playSound('correct');
      } else {
        handleWrongAnswer();
        playSound('wrong');
        
        // Actualizar contadores de la ronda
        setRoundWrongAnswers(prev => prev + 1);
        
        if (gameMode === 'multi') {
          addToast(`❌ ¡${players[currentPlayer]?.name} falló!`, 'error', 2000);
        }
      }
      
      // Avanzar a la siguiente pregunta
      if (currentQuestion < shuffledQuestions.length - 1) {
        setTimeout(() => {
          const nextQuestion = currentQuestion + 1;
          
          // Verificar si vamos a empezar una nueva ronda
          const isNewRound = nextQuestion % questionsPerRound === 0;
          
          setCurrentQuestion(nextQuestion);
          
          // Solo incrementamos la ronda si es una nueva ronda Y no es la última pregunta
          if (isNewRound && nextQuestion < shuffledQuestions.length) {
            setCurrentRound(prev => {
              console.log(`🔄 Incrementando ronda de ${prev} a ${prev + 1}`);
              return prev + 1;
            });
          }
          
          setSelectedAnswer(null);
          
          if (gameMode === 'multi') {
            nextPlayer();
          }
        }, 1500);
      } else {
        // Fin del juego
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
            addToast(`🏆 ¡Ganador: ${players[winner[0]]?.name} con ${winner[1]} puntos!`, 'success', 4000);
          } else {
            addToast(`🎮 ¡Juego completado! Puntuación final: ${score}`, 'success', 4000);
          }
          
          setTimeout(() => {
            setGameState('playerSelect');
            resetMultiplayer();
          }, 3000);
        }, 2000);
      }
    }, 1000);
  }, [selectedAnswer, showRoundPause, playSound, shuffledQuestions, currentQuestion, boosts.doublePoints.active, gameMode, addPlayerScore, currentPlayer, players, addCoins, addExperience, handleCorrectAnswer, totalCorrectAnswers, checkAndUpdateTitle, handleWrongAnswer, questionsPerRound, scores, score, resetMultiplayer, addToast, nextPlayer]);

  const handleCloseStore = useCallback(() => {
    setShowStore(false);
    playSound('click');
  }, [playSound]);

  const handleCloseProfile = useCallback(() => {
    setShowProfile(false);
    playSound('click');
  }, [playSound]);

  // Renderizado condicional
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
      <GameHeader 
        theme={theme}
        userName={userName}
        coins={coins}
        gameMode={gameMode}
        currentRound={currentRound}
        totalQuestions={shuffledQuestions.length}
        currentQuestion={currentQuestion}
        correctStreak={correctStreak}
        currentTitle={currentTitle}
        onProfileClick={() => {
          setShowProfile(true);
          playSound('click');
        }}
        onStoreClick={() => {
          setShowStore(true);
          playSound('click');
        }}
        playSound={playSound}
      />

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
              key={`pause-${currentRound}`}
              round={currentRound}
              stats={roundStats}
              onContinue={handleContinueAfterPause}
              onGoToStore={handleGoToStore}
            />
          ) : (
            <motion.div
              key={`game-${currentQuestion}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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