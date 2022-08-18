export default {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  password: process.env.DB_PASSWORD || 'password',
  username: process.env.DB_USERNAME || 'user',
  databaseName: process.env.DB_NAME || 'expense-tracking-service',
};
