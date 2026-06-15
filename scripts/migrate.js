require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../db/pool');

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');

  try {
    await pool.query(schema);
    console.log('Database schema applied successfully.');
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
