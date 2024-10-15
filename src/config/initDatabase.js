import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import sequelize from './database.js';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, POSTGRES_ADMIN_USER, POSTGRES_ADMIN_PASSWORD } = process.env;

async function initDatabase() {
  // Create a connection to the default 'postgres' database
  const adminSequelize = new Sequelize('postgres', POSTGRES_ADMIN_USER, POSTGRES_ADMIN_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: msg => logger.debug(msg)
  });

  try {
    // Check if the database exists
    const [results] = await adminSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );

    if (results.length === 0) {
      logger.info(`Creating database ${DB_NAME}`);
      await adminSequelize.query(`CREATE DATABASE ${DB_NAME}`);
    }

    // Close the admin connection
    await adminSequelize.close();

    // Authenticate with the application database
    await sequelize.authenticate();
    logger.info('Sequelize connected to the application database successfully');

    // Create or update user (if needed)
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
          CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
        ELSE
          ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
        END IF;
      END
      $$;
    `);

    // Grant privileges
    await sequelize.query(`
      GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
      GRANT ALL PRIVILEGES ON SCHEMA public TO ${DB_USER};
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
    `);

    logger.info('Database and user setup complete');

    // Sync all models
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized successfully');

    return sequelize;
  } catch (error) {
    logger.error('Error in database initialization:', error);
    return false;
  } finally {
    if (adminSequelize) {
      await adminSequelize.close();
    }
  }
}

export default initDatabase;