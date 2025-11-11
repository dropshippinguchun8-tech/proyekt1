const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];

const missing = requiredEnvVars.filter((key) => typeof process.env[key] === 'undefined');

if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `Warning: Missing environment variables [${missing.join(
      ', ',
    )}]. Application may not function correctly.`,
  );
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'cpamarket',
    username: process.env.DB_USER || 'cpamarket',
    password: process.env.DB_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};
