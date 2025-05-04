require('dotenv').config();
const { cleanupDatabase } = require('../src/utils/cleanup');

console.log('Iniciando proceso de limpieza de la base de datos...');
console.log('ADVERTENCIA: Este proceso eliminará TODOS los usuarios y tareas.');
console.log('Presiona Ctrl+C para cancelar o espera 5 segundos para continuar...');

setTimeout(async () => {
  try {
    await cleanupDatabase();
    console.log('Base de datos limpiada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    process.exit(1);
  }
}, 5000); 