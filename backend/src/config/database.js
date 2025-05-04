const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const DB_NAME = 'task_management';
const DB_USER = 'root';
const DB_PASSWORD = '';
const DB_HOST = 'localhost';

const initDatabase = async () => {
    try {
        // Crear conexión temporal para crear la base de datos si no existe
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        // Crear la base de datos si no existe
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        await connection.end();

        // Conectar a la base de datos
        const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: 'mysql',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // Sincronizar todos los modelos
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada correctamente.');

        return sequelize;
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
};

module.exports = { initDatabase }; 