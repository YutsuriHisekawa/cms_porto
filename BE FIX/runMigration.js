const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runMigration() {
  const sqlPath = path.join(__dirname, 'migrations/20250705_alter_users_add_slug.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('File migrasi tidak ditemukan:', sqlPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');
  try {
    await pool.query(sql);
    console.log('Migrasi berhasil dijalankan!');
  } catch (err) {
    console.error('Error migrasi:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
