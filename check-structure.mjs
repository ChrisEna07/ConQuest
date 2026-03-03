// check-structure.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToCheck = [
  'src/context/GameContext.jsx',
  'src/components/Game/Question.jsx',
  'src/components/Store/Store.jsx',
  'src/components/Profile/UserProfile.jsx',
  'src/components/UI/Coins.jsx',
  'src/components/UI/LevelProgress.jsx',
  'src/App.jsx',
  'src/main.jsx'
];

console.log('🔍 Verificando estructura de archivos:\n');

let allFound = true;

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} - Encontrado`);
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
    allFound = false;
  }
});

if (allFound) {
  console.log('\n🎉 ¡Todos los archivos necesarios existen!');
} else {
  console.log('\n⚠️  Faltan algunos archivos. Revisa la lista arriba.');
}

// Verificar package.json
console.log('\n📦 Verificando package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('✅ package.json encontrado');
  
  // Verificar dependencias
  const dependencies = {
    'framer-motion': packageJson.dependencies?.['framer-motion'],
    'react': packageJson.dependencies?.react,
    'react-dom': packageJson.dependencies?.['react-dom']
  };
  
  console.log('\n📚 Dependencias:');
  for (const [dep, version] of Object.entries(dependencies)) {
    if (version) {
      console.log(`✅ ${dep}: ${version}`);
    } else {
      console.log(`❌ ${dep}: No instalado`);
    }
  }
  
} catch (error) {
  console.log('❌ Error leyendo package.json');
}