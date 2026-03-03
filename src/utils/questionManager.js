import { questions } from '../../data/questions';

const STORAGE_KEY = 'recent_questions_ids';

export const generateGameQuestions = (amount = 20) => {
  const recentIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Filtrar preguntas que NO se hayan usado recientemente
  let available = questions.filter(q => !recentIds.includes(q.id));

  // Si quedan pocas, resetear historial
  if (available.length < amount) {
    available = questions;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  // Mezclar (shuffle real)
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  const selected = shuffled.slice(0, amount);

  // Guardar las usadas (máximo 50 guardadas)
  const updatedRecent = [...recentIds, ...selected.map(q => q.id)].slice(-50);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecent));

  return selected;
};