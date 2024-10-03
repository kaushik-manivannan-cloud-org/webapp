import { Sequelize } from 'sequelize';
import sequelize from './database.js';
import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import User from '../models/user.js';

dotenv.config();

const { DB_HOST, DB_PORT } = process.env;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

async function createClient(database) {
  return new pg.Client({
    host: DB_HOST,
    port: DB_PORT,
    user: 'kaushik',
    database: database
  });
}

async function initDatabase() {
  let adminClient = await createClient('postgres');

  try {
    await adminClient.connect();
    logger.info('Connected to PostgreSQL as postgres user');

    // Check if the database exists
    const dbExists = await adminClient.query(`
      SELECT 1 FROM pg_database WHERE datname = $1
    `, [DB_NAME]);

    if (dbExists.rows.length === 0) {
      logger.info(`Creating database ${DB_NAME}`);
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
    }

    // Check if the user exists
    const userExists = await adminClient.query(`
      SELECT 1 FROM pg_roles WHERE rolname = $1
    `, [DB_USER]);

    if (userExists.rows.length === 0) {
      logger.info(`Creating user ${DB_USER}`);
      await adminClient.query(`CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'`);
    } else {
      // Update user's password
      await adminClient.query(`ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'`);
    }

    // Grant privileges
    await adminClient.query(`GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER}`);
    
    // Close the connection to 'postgres' database
    await adminClient.end();

    // Create a new client connected to the application database
    adminClient = await createClient(DB_NAME);
    await adminClient.connect();

    // Grant schema privileges
    await adminClient.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO ${DB_USER}`);
    await adminClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER}`);
    await adminClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER}`);
    
    logger.info('Database and user setup complete');
  } catch (error) {
    logger.error('Error in database initialization:', error);
    throw error;
  } finally {
    if (adminClient) {
      await adminClient.end();
    }
  }

  try {
    await sequelize.authenticate();
    logger.info('Sequelize connected to the database successfully');

    // Sync all models
    await User.sync({ alter: true });
    logger.info('Database synchronized successfully');

    return sequelize;
  } catch (error) {
    logger.error('Sequelize unable to connect to the database:', error);
    throw error;
  }
}

export default initDatabase;