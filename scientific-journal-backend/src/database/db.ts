import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuraciones por motor
const dbConfig = {
  mysql: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: parseInt(process.env.DB_PORT || '3306'),
  },
  postgres: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: parseInt(process.env.DB_PORT || '5432'),
  },
  mssql: {
    dialect: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: parseInt(process.env.DB_PORT || '1433'),
  },
  oracle: {
    dialect: 'oracle',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'oracle',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: parseInt(process.env.DB_PORT || '1521'),
  },
};

// Motor seleccionado desde .env
const dbEngine = process.env.DB_ENGINE || 'mysql';
const config = dbConfig[dbEngine as keyof typeof dbConfig];

if (!config) {
  throw new Error(`Unsupported DB_ENGINE: ${dbEngine}`);
}

// Instancia Sequelize
export const database = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect as any,
  port: config.port,
});

// Crear tablas
export async function generateDb() {
  try {
    await database.sync({ alter: true }); // cuidado: borra y recrea todas las tablas
    console.log('Base de datos y tablas creadas');
  } catch (error) {
    console.error('Error creando la base de datos:', error);
  }
}

// Ejecutar creación
generateDb();
