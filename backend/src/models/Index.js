// backend/src/models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Inicializa Sequelize con MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    console.error('Por favor, verifica que:');
    console.error('1. MySQL está instalado y ejecutándose');
    console.error('2. El usuario y la base de datos existen');
    console.error('3. Las credenciales en .env son correctas');
    process.exit(1);
  }
};

// Importar modelos
const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);
const SharedTask = require('./SharedTask')(sequelize);

// Relación: User 1:N Task
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

// Relaciones para tareas compartidas
User.hasMany(SharedTask, { foreignKey: 'ownerId', as: 'sharedTasks' });
User.hasMany(SharedTask, { foreignKey: 'sharedWithId', as: 'receivedTasks' });
Task.hasMany(SharedTask, { foreignKey: 'taskId', onDelete: 'CASCADE' });
SharedTask.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
SharedTask.belongsTo(User, { foreignKey: 'sharedWithId', as: 'sharedWith' });
SharedTask.belongsTo(Task, { foreignKey: 'taskId' });

// Sincronizar modelos con la base de datos
const syncModels = async () => {
  try {
    // Usamos alter: true en lugar de force: true para preservar los datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    process.exit(1);
  }
};

// Inicializar
const init = async () => {
  await testConnection();
  await syncModels();
};

module.exports = {
  sequelize,
  User,
  Task,
  SharedTask,
  init
};
