const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const initDatabase = async () => {
    try {
        // Crear conexión temporal para crear la base de datos si no existe
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        // Crear la base de datos si no existe
        await connection.query('CREATE DATABASE IF NOT EXISTS proyecto_tareas');
        await connection.end();

        // Conectar a la base de datos
        const sequelize = new Sequelize('proyecto_tareas', 'root', '', {
            host: 'localhost',
            dialect: 'mysql',
            logging: false
        });

        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Sincronizar todos los modelos
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
};

module.exports = initDatabase; 