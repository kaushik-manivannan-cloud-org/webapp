import express from 'express';
import sequelize from './config/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database:', err));

// Test the Database Connection
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((error) => console.error('Unable to connect to the database:', error));

