// src/context/GameContext.jsx
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // Estados existentes
  const [coins, setCoins] = useState(100);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [userName, setUserName] = useState('');
  const [currentTheme, setCurrentTheme] = useState('default');
  const [avatar, setAvatar] = useState('default');
  const [toasts, setToasts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Estados para títulos y rachas
  const [currentTitle, setCurrentTitle] = useState('Novato');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [unlockedTitles, setUnlockedTitles] = useState(['Novato']);
  
  // Sistema de títulos
  const titles = {
    Novato: { 
      icon: '🌱', 
      requirement: 0, 
      description: 'Comienza tu aventura',
      color: 'from-gray-500 to-gray-600'
    },
    Aprendiz: { 
      icon: '📚', 
      requirement: 5, 
      description: 'Responde 5 preguntas correctas',
      color: 'from-blue-500 to-blue-600'
    },
    Conquistador: { 
      icon: '⚔️', 
      requirement: 10, 
      description: 'Responde 10 preguntas correctas',
      color: 'from-green-500 to-green-600'
    },
    Estratega: { 
      icon: '🎯', 
      requirement: 20, 
      description: 'Responde 20 preguntas correctas',
      color: 'from-purple-500 to-purple-600'
    },
    Leyenda: { 
      icon: '🏆', 
      requirement: 30, 
      description: 'Responde 30 preguntas correctas',
      color: 'from-yellow-500 to-yellow-600'
    },
    Inmortal: { 
      icon: '⚡', 
      requirement: 50, 
      description: 'Responde 50 preguntas correctas',
      color: 'from-red-500 to-red-600'
    }
  };

  // Títulos por racha consecutiva
  const streakTitles = {
    '5': { name: 'Racha de Fuego', icon: '🔥', description: '5 respuestas correctas consecutivas' },
    '10': { name: 'Imparable', icon: '💫', description: '10 respuestas correctas consecutivas' },
    '15': { name: 'Dominador', icon: '👑', description: '15 respuestas correctas consecutivas' },
    '20': { name: 'Dios del Conocimiento', icon: '✨', description: '20 respuestas correctas consecutivas' }
  };

  const [gameMode, setGameMode] = useState('single');
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState({});
  
  const [boosts, setBoosts] = useState({
    doublePoints: { quantity: 2, active: false, name: 'Puntos Dobles', icon: '2️⃣', description: 'Gana el doble de monedas' },
    skipQuestion: { quantity: 1, active: false, name: 'Saltar Pregunta', icon: '⏭️', description: 'Salta una pregunta difícil' },
    timeFreeze: { quantity: 1, active: false, name: 'Congelar Tiempo', icon: '❄️', description: '10 segundos extra' },
    fiftyFifty: { quantity: 3, active: false, name: '50/50', icon: '🎯', description: 'Elimina 2 opciones incorrectas' }
  });

  const themes = {
    default: { primary: '#6366f1', secondary: '#8b5cf6', bg: 'from-indigo-500 to-purple-600' },
    dark: { primary: '#1f2937', secondary: '#374151', bg: 'from-gray-800 to-gray-900' },
    nature: { primary: '#10b981', secondary: '#34d399', bg: 'from-green-500 to-emerald-600' },
    ocean: { primary: '#3b82f6', secondary: '#0ea5e9', bg: 'from-blue-500 to-cyan-600' },
    sunset: { primary: '#f43f5e', secondary: '#fb7185', bg: 'from-rose-500 to-pink-600' }
  };

  // Sistema de sonidos
  const sounds = {
    correct: useRef(null),
    wrong: useRef(null),
    coin: useRef(null),
    levelup: useRef(null),
    click: useRef(null),
    landing: useRef(null),
    title: useRef(null)
  };

  // Inicializar sonidos con manejo de errores mejorado
  useEffect(() => {
    const soundFiles = ['correct', 'wrong', 'coin', 'levelup', 'click', 'landing', 'title'];
    
    soundFiles.forEach(key => {
      try {
        const audioPath = `/sounds/${key}.mp3`;
        console.log(`Cargando sonido: ${audioPath}`);
        
        const audio = new Audio(audioPath);
        audio.volume = 0.5;
        
        // Manejar errores de carga
        audio.onerror = () => {
          console.log(`⚠️ No se pudo cargar el sonido: ${key} - Continuando sin sonido`);
          // Establecer el ref como null para evitar intentos de reproducción
          sounds[key].current = null;
        };
        
        // Cuando el audio esté listo
        audio.oncanplaythrough = () => {
          console.log(`✅ Sonido ${key} cargado correctamente`);
          sounds[key].current = audio;
        };
        
        // Precargar el audio
        audio.load();
      } catch (error) {
        console.log(`❌ Error al crear audio para ${key}:`, error);
        sounds[key].current = null;
      }
    });

    // Configurar loop para landing si existe
    const checkLandingSound = setInterval(() => {
      if (sounds.landing.current) {
        sounds.landing.current.loop = true;
        clearInterval(checkLandingSound);
      }
    }, 100);

    // Limpiar al desmontar
    return () => {
      clearInterval(checkLandingSound);
      Object.values(sounds).forEach(sound => {
        if (sound.current) {
          sound.current.pause();
          sound.current.src = '';
          sound.current = null;
        }
      });
    };
  }, []);

  // Función para reproducir sonidos con manejo de errores mejorado
  const playSound = (soundName) => {
    if (!soundEnabled) return;
    
    const sound = sounds[soundName]?.current;
    if (!sound) {
      // Silenciosamente ignorar si el sonido no está disponible
      return;
    }
    
    try {
      sound.currentTime = 0;
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          // Ignorar errores de interacción del usuario
          if (e.name !== 'NotAllowedError' && e.name !== 'NotSupportedError') {
            console.log(`Error reproduciendo sonido ${soundName}:`, e);
          }
        });
      }
    } catch (e) {
      // Error silencioso
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled) {
      // Pausar todos los sonidos al desactivar
      Object.values(sounds).forEach(sound => {
        if (sound.current) {
          sound.current.pause();
        }
      });
    }
  };

  // Función para verificar y actualizar títulos
  const checkAndUpdateTitle = (totalCorrectAnswers) => {
    let newTitle = currentTitle;
    let titleUnlocked = false;
    
    // Verificar títulos por cantidad total
    for (const [titleName, titleData] of Object.entries(titles)) {
      if (totalCorrectAnswers >= titleData.requirement) {
        newTitle = titleName;
        if (!unlockedTitles.includes(titleName)) {
          setUnlockedTitles(prev => [...prev, titleName]);
          playSound('title');
          titleUnlocked = true;
          addToast(`🏆 ¡Nuevo título desbloqueado: ${titleName}!`, 'title', 5000);
        }
      }
    }
    
    if (newTitle !== currentTitle && !titleUnlocked) {
      setCurrentTitle(newTitle);
      addToast(`🎉 ¡Has ascendido a ${newTitle}!`, 'success', 4000);
    }
  };

  // Función para manejar rachas
  const handleCorrectAnswer = () => {
    const newStreak = correctStreak + 1;
    setCorrectStreak(newStreak);
    
    if (newStreak > maxStreak) {
      setMaxStreak(newStreak);
    }
    
    // Verificar títulos por racha
    if (streakTitles[newStreak.toString()]) {
      const streakTitle = streakTitles[newStreak.toString()];
      addToast(`🔥 ¡${streakTitle.name}! ${streakTitle.description}`, 'streak', 4000);
      playSound('title');
    }
  };

  const handleWrongAnswer = () => {
    if (correctStreak >= 5) {
      addToast(`😢 ¡Racha de ${correctStreak} respuestas terminada!`, 'info', 3000);
    }
    setCorrectStreak(0);
  };

  const resetStreak = () => {
    setCorrectStreak(0);
  };

  // Funciones para multijugador
  const initializeMultiplayer = (playerNames) => {
    const newPlayers = playerNames.map((name, index) => ({
      id: index,
      name: name,
      avatar: 'default',
      score: 0,
      coins: 100,
      streak: 0,
      title: 'Novato'
    }));
    setPlayers(newPlayers);
    setGameMode('multi');
    setCurrentPlayer(0);
    
    const initialScores = {};
    playerNames.forEach((name, index) => {
      initialScores[index] = 0;
    });
    setScores(initialScores);
  };

  const nextPlayer = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  const addPlayerScore = (playerId, points) => {
    setScores(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + points
    }));
  };

  const resetMultiplayer = () => {
    setGameMode('single');
    setPlayers([]);
    setCurrentPlayer(0);
    setScores({});
  };

  // Funciones de monedas con sonidos
  const addCoins = (amount) => {
    setCoins(prev => prev + amount);
    playSound('coin');
  };
  
  const spendCoins = (amount) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  const addExperience = (exp) => {
    const newExp = experience + exp;
    const expNeeded = level * 100;
    
    if (newExp >= expNeeded) {
      setLevel(prev => prev + 1);
      setExperience(newExp - expNeeded);
      addCoins(50);
      playSound('levelup');
      addToast(`🎉 ¡Subiste al nivel ${level + 1}!`, 'levelup', 4000);
    } else {
      setExperience(newExp);
    }
  };

  // Funciones para toasts con control de duplicados
  const addToast = (message, type = 'success', duration = 3000) => {
    // Evitar toasts duplicados del mismo mensaje en menos de 2 segundos
    const lastToast = toasts[toasts.length - 1];
    if (lastToast && lastToast.message === message && Date.now() - lastToast.id < 2000) {
      return lastToast.id;
    }
    
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Limpiar toasts automáticamente (solo como respaldo)
  useEffect(() => {
    const timers = toasts.map(toast => {
      return setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration || 3000);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [toasts]);

  // Funciones de boosts
  const useBoost = (boostType) => {
    if (boosts[boostType]?.quantity > 0) {
      setBoosts(prev => ({
        ...prev,
        [boostType]: { 
          ...prev[boostType], 
          active: true, 
          quantity: prev[boostType].quantity - 1 
        }
      }));
      
      playSound('click');
      addToast(`✨ ¡${boosts[boostType].name} activado para esta pregunta!`, 'boost', 3000);
      return true;
    } else {
      addToast(`❌ No tienes ${boosts[boostType]?.name || boostType} disponible`, 'error', 3000);
      return false;
    }
  };

  // Función para desactivar boosts
  const deactivateBoost = (boostType) => {
    setBoosts(prev => ({
      ...prev,
      [boostType]: { ...prev[boostType], active: false }
    }));
  };

  const buyBoost = (boostType, cost) => {
    if (spendCoins(cost)) {
      setBoosts(prev => ({
        ...prev,
        [boostType]: { 
          ...prev[boostType], 
          quantity: prev[boostType].quantity + 1 
        }
      }));
      
      playSound('coin');
      addToast(`🛒 ¡Has comprado ${boosts[boostType].name}!`, 'coin', 3000);
      return true;
    } else {
      addToast('❌ ¡No tienes suficientes monedas!', 'error', 3000);
      return false;
    }
  };

  const buyTheme = (themeKey, cost) => {
    if (spendCoins(cost)) {
      setCurrentTheme(themeKey);
      
      const themeNames = {
        dark: 'Modo Oscuro',
        nature: 'Naturaleza',
        ocean: 'Oceánico',
        sunset: 'Atardecer'
      };
      
      playSound('coin');
      addToast(`🎨 ¡Tema ${themeNames[themeKey] || themeKey} adquirido!`, 'success', 3000);
      return true;
    } else {
      addToast('❌ No tienes suficientes monedas', 'error', 3000);
      return false;
    }
  };

  const buyAvatar = (avatarKey, cost) => {
    if (spendCoins(cost)) {
      setAvatar(avatarKey);
      
      const avatarNames = {
        ninja: 'Ninja',
        wizard: 'Mago',
        warrior: 'Guerrero',
        alien: 'Alienígena'
      };
      
      playSound('coin');
      addToast(`👤 ¡Avatar ${avatarNames[avatarKey] || avatarKey} desbloqueado!`, 'success', 3000);
      return true;
    } else {
      addToast('❌ No tienes suficientes monedas', 'error', 3000);
      return false;
    }
  };

  return (
    <GameContext.Provider value={{
      coins,
      level,
      experience,
      boosts,
      currentTheme,
      avatar,
      userName,
      themes,
      toasts,
      soundEnabled,
      gameMode,
      players,
      currentPlayer,
      scores,
      currentTitle,
      correctStreak,
      maxStreak,
      unlockedTitles,
      titles,
      streakTitles,
      setUserName,
      addCoins,
      spendCoins,
      addExperience,
      useBoost,
      deactivateBoost,
      buyBoost,
      buyTheme,
      buyAvatar,
      addToast,
      removeToast,
      playSound,
      toggleSound,
      initializeMultiplayer,
      nextPlayer,
      addPlayerScore,
      resetMultiplayer,
      handleCorrectAnswer,
      handleWrongAnswer,
      resetStreak,
      checkAndUpdateTitle
    }}>
      {children}
    </GameContext.Provider>
  );
};