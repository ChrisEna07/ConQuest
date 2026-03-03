// src/data/index.js
import { geografiaQuestions } from './geografia';
import { historiaQuestions } from './historia';
import { cienciaQuestions } from './ciencia';
import { biologiaQuestions } from './biologia';
import { culturaGeneralQuestions } from './cultura_general';
import { harryPotterQuestions } from './harry_potter';
import { narutoQuestions } from './naruto';

// Combinar todas las preguntas
export const allQuestions = [
  ...geografiaQuestions,
  ...historiaQuestions,
  ...cienciaQuestions,
  ...biologiaQuestions,
  ...culturaGeneralQuestions,
  ...harryPotterQuestions,
  ...narutoQuestions
];

// Función para obtener preguntas aleatorias
export const getRandomQuestions = (count = 30) => {
  // Mezclar todas las preguntas
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  // Devolver las primeras 'count' preguntas
  return shuffled.slice(0, Math.min(count, allQuestions.length));
};

// Función para obtener preguntas por categoría
export const getQuestionsByCategory = (category, count = 10) => {
  const categoryQuestions = allQuestions.filter(q => q.category === category);
  const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, categoryQuestions.length));
};

// Función para obtener preguntas por dificultad
export const getQuestionsByDifficulty = (difficulty, count = 10) => {
  const difficultyQuestions = allQuestions.filter(q => q.difficulty === difficulty);
  const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, difficultyQuestions.length));
};

// Exportar también las preguntas por categoría individualmente
export {
  geografiaQuestions,
  historiaQuestions,
  cienciaQuestions,
  biologiaQuestions,
  culturaGeneralQuestions,
  harryPotterQuestions,
  narutoQuestions
};

// Exportar metadatos
export const categories = [
  'Geografía',
  'Historia',
  'Ciencia',
  'Biología',
  'Arte',
  'Literatura',
  'Música',
  'Deportes',
  'Tecnología',
  'Cine',
  'Harry Potter',
  'Naruto',
  'Cultura General',
  'Gastronomía',
  'Idiomas',
  'Mitología',
  'Religión',
  'Moda',
  'Animales'
];

export const totalQuestions = allQuestions.length;