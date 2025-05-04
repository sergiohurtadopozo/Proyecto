const { Task, User, sequelize } = require('../models');

async function cleanupDatabase() {
  const queryInterface = sequelize.getQueryInterface();
  const transaction = await sequelize.transaction();
  
  try {
    console.log('Iniciando limpieza de la base de datos...');
    
    // Desactivar restricciones de clave foránea
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
    
    // Limpiar tablas
    console.log('Eliminando tareas...');
    await Task.destroy({ 
      where: {}, 
      force: true,
      truncate: true,
      transaction 
    });
    
    console.log('Eliminando usuarios...');
    await User.destroy({ 
      where: {}, 
      force: true,
      truncate: true,
      transaction 
    });
    
    // Reactivar restricciones de clave foránea
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
    
    await transaction.commit();
    console.log('Limpieza completada exitosamente');
  } catch (error) {
    await transaction.rollback();
    console.error('Error durante la limpieza:', error);
    throw error;
  }
}

// Si se ejecuta directamente este archivo
if (require.main === module) {
  cleanupDatabase()
    .then(() => {
      console.log('Proceso completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { cleanupDatabase }; 