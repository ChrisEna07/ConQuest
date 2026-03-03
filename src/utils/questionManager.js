// src/utils/QuestionManager.js
import { allQuestions } from '../data/index';

const STORAGE_KEY = 'recent_questions_ids';

export const generateGameQuestions = (amount = 20) => {
  // Verificar que allQuestions existe y es un array
  if (!allQuestions || !Array.isArray(allQuestions)) {
    console.error('Error: allQuestions no está disponible o no es un array');
    return [];
  }

  const recentIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Filtrar preguntas que NO se hayan usado recientemente
  let available = allQuestions.filter(q => !recentIds.includes(q.id));

  // Si quedan pocas, resetear historial
  if (available.length < amount) {
    console.log('🔄 Pocas preguntas nuevas disponibles, reseteando historial');
    available = allQuestions;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  // Mezclar (shuffle real) - algoritmo Fisher-Yates
  const shuffled = [...available];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, amount);

  // Guardar las usadas (máximo 50 guardadas)
  const updatedRecent = [...recentIds, ...selected.map(q => q.id)].slice(-50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecent));

  return selected;
};

// Función auxiliar para obtener estadísticas de preguntas
export const getQuestionStats = () => {
  const recentIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return {
    totalQuestions: allQuestions?.length || 0,
    recentlyUsed: recentIds.length,
    availableQuestions: (allQuestions?.length || 0) - recentIds.length
  };
};

// Función para resetear el historial manualmente
export const resetQuestionHistory = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  console.log('🔄 Historial de preguntas reseteado');
};

// Función para obtener preguntas por categoría sin repetir
export const getQuestionsByCategoryUnique = (category, amount = 10) => {
  const recentIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const categoryQuestions = allQuestions.filter(q => q.category === category);
  
  let available = categoryQuestions.filter(q => !recentIds.includes(q.id));
  
  if (available.length < amount) {
    available = categoryQuestions;
  }
  
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, amount);
  
  const updatedRecent = [...recentIds, ...selected.map(q => q.id)].slice(-50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecent));
  
  return selected;
};