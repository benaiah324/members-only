require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Pool } = require('pg');

function getDbName(connectionString) {
  const match = connectionString.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : 'members_only';
}

async function setup() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. Copy .env.example to .env and configure it.');
    process.exit(1);
  }

  const dbName = getDbName(databaseUrl);

  try {
    const check = execSync(
      `psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbName}'"`,
      { encoding: 'utf8' }
    ).trim();

    if (check !== '1') {
      execSync(`psql -d postgres -c "CREATE DATABASE \\"${dbName}\\""`, { stdio: 'inherit' });
      console.log(`Created database: ${dbName}`);
    } else {
      console.log(`Database already exists: ${dbName}`);
    }
  } catch (err) {
    console.error('Could not create database via psql:', err.message);
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');

  try {
    await pool.query(schema);
    console.log('Schema applied successfully.');
  } finally {
    await pool.end();
  }
}

setup().catch((err) => {
  console.error('Database setup failed:', err.message);
  process.exit(1);
});
