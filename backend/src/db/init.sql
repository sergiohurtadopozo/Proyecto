-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS task_management;

-- Usar la base de datos
USE task_management;

-- Crear el usuario si no existe
CREATE USER IF NOT EXISTS 'appuser'@'localhost' IDENTIFIED BY 'AppUser2024!Secure';

-- Otorgar todos los privilegios al usuario
GRANT ALL PRIVILEGES ON task_management.* TO 'appuser'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear la tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    dueDate DATETIME,
    userId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
); 