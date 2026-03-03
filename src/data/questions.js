// src/data/questions.js
import { 
  allQuestions, 
  getRandomQuestions, 
  getQuestionsByCategory, 
  getQuestionsByDifficulty,
  geografiaQuestions,
  historiaQuestions,
  cienciaQuestions,
  biologiaQuestions,
  culturaGeneralQuestions,
  harryPotterQuestions,
  narutoQuestions,
  categories,
  totalQuestions
} from './index';

// Re-exportar todo
export {
  allQuestions as questions,
  getRandomQuestions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  geografiaQuestions,
  historiaQuestions,
  cienciaQuestions,
  biologiaQuestions,
  culturaGeneralQuestions,
  harryPotterQuestions,
  narutoQuestions,
  categories,
  totalQuestions
};

// Export default para compatibilidad
export default allQuestions;