import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authPath = path.resolve(__dirname, 'auth_info');

console.log('Contenido actual de auth_info:');
try {
  const files = fs.readdirSync(authPath);
  console.log(files);
} catch (error) {
  console.log('Error al leer:', error.message);
}

console.log('Eliminando archivos en auth_info...');
try {
  const files = fs.readdirSync(authPath);
  for (const file of files) {
    const filePath = path.join(authPath, file);
    fs.rmSync(filePath, { recursive: true, force: true });
    console.log(`Eliminado: ${file}`);
  }
  console.log('Archivos eliminados.');
} catch (error) {
  console.error('Error al eliminar archivos:', error.message);
}