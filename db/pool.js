require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production' || connectionString?.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = pool;
